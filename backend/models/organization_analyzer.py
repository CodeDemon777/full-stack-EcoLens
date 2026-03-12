from __future__ import annotations

from functools import lru_cache

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

from utils.logger import logger

REQUIRED_COLUMNS = [
    "electricity_kwh",
    "fuel_liters",
    "transport_km",
    "waste_kg",
    "employee_count",
]

CATEGORY_META = {
    "energy": {
        "label": "Energy",
        "source_field": "electricity_kwh",
        "factor": 0.00042,
        "color": "#10b981",
    },
    "fuel": {
        "label": "Fuel",
        "source_field": "fuel_liters",
        "factor": 0.00268,
        "color": "#f97316",
    },
    "transport": {
        "label": "Transport",
        "source_field": "transport_km",
        "factor": 0.00012,
        "color": "#3b82f6",
    },
    "waste": {
        "label": "Waste",
        "source_field": "waste_kg",
        "factor": 0.00045,
        "color": "#8b5cf6",
    },
    "workforce": {
        "label": "Workforce",
        "source_field": "employee_count",
        "factor": 0.08,
        "color": "#f59e0b",
    },
}

MODEL_FEATURES = [
    "electricity_kwh",
    "fuel_liters",
    "transport_km",
    "waste_kg",
    "employee_count",
    "electricity_per_employee",
    "transport_per_employee",
    "waste_per_employee",
    "fuel_per_employee",
    "baseline_total",
]


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    normalized = {column: column.strip().lower() for column in df.columns}
    return df.rename(columns=normalized)


def _validate_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        raise ValueError("The uploaded CSV is empty.")

    df = _normalize_columns(df)
    missing_columns = [column for column in REQUIRED_COLUMNS if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

    working_df = df[REQUIRED_COLUMNS].copy()
    working_df = working_df.replace(r"^\s*$", np.nan, regex=True)

    for column in REQUIRED_COLUMNS:
        working_df[column] = pd.to_numeric(working_df[column], errors="coerce")

    invalid_rows = working_df[working_df.isna().any(axis=1)]
    if not invalid_rows.empty:
        sample_rows = ", ".join(str(index + 2) for index in invalid_rows.index[:5])
        raise ValueError(
            f"Detected empty or non-numeric values in required fields. Check CSV rows: {sample_rows}."
        )

    negative_rows = working_df[(working_df < 0).any(axis=1)]
    if not negative_rows.empty:
        sample_rows = ", ".join(str(index + 2) for index in negative_rows.index[:5])
        raise ValueError(f"Negative activity values are not allowed. Check CSV rows: {sample_rows}.")

    zero_employee_rows = working_df[working_df["employee_count"] <= 0]
    if not zero_employee_rows.empty:
        sample_rows = ", ".join(str(index + 2) for index in zero_employee_rows.index[:5])
        raise ValueError(f"employee_count must be greater than zero. Check CSV rows: {sample_rows}.")

    return working_df


def _get_baseline_category_emissions(activity_totals: dict[str, float]) -> dict[str, float]:
    return {
        category: activity_totals[meta["source_field"]] * meta["factor"]
        for category, meta in CATEGORY_META.items()
    }


def _build_feature_frame(activity_totals: dict[str, float]) -> pd.DataFrame:
    employees = max(activity_totals["employee_count"], 1.0)
    baseline_categories = _get_baseline_category_emissions(activity_totals)
    baseline_total = sum(baseline_categories.values())

    feature_row = {
        "electricity_kwh": activity_totals["electricity_kwh"],
        "fuel_liters": activity_totals["fuel_liters"],
        "transport_km": activity_totals["transport_km"],
        "waste_kg": activity_totals["waste_kg"],
        "employee_count": activity_totals["employee_count"],
        "electricity_per_employee": activity_totals["electricity_kwh"] / employees,
        "transport_per_employee": activity_totals["transport_km"] / employees,
        "waste_per_employee": activity_totals["waste_kg"] / employees,
        "fuel_per_employee": activity_totals["fuel_liters"] / employees,
        "baseline_total": baseline_total,
    }

    return pd.DataFrame([feature_row], columns=MODEL_FEATURES)


def _build_training_dataset(sample_count: int = 900) -> tuple[pd.DataFrame, np.ndarray]:
    rng = np.random.default_rng(42)
    rows: list[dict[str, float]] = []
    targets: list[float] = []

    for _ in range(sample_count):
        electricity_kwh = float(rng.uniform(8_000, 2_500_000))
        fuel_liters = float(rng.uniform(400, 180_000))
        transport_km = float(rng.uniform(2_000, 2_200_000))
        waste_kg = float(rng.uniform(150, 450_000))
        employee_count = float(rng.uniform(15, 18_000))

        activity_totals = {
            "electricity_kwh": electricity_kwh,
            "fuel_liters": fuel_liters,
            "transport_km": transport_km,
            "waste_kg": waste_kg,
            "employee_count": employee_count,
        }

        feature_frame = _build_feature_frame(activity_totals)
        feature_row = feature_frame.iloc[0].to_dict()
        baseline_total = feature_row["baseline_total"]

        electricity_intensity = feature_row["electricity_per_employee"]
        transport_intensity = feature_row["transport_per_employee"]
        fuel_intensity = feature_row["fuel_per_employee"]
        waste_intensity = feature_row["waste_per_employee"]

        operational_adjustment = 1.0
        operational_adjustment += np.clip((electricity_intensity - 900) / 9000, -0.05, 0.18)
        operational_adjustment += np.clip((transport_intensity - 140) / 2200, -0.03, 0.12)
        operational_adjustment += np.clip((fuel_intensity - 9) / 160, -0.02, 0.10)
        operational_adjustment += np.clip((waste_intensity - 5) / 220, -0.02, 0.08)

        target = baseline_total * operational_adjustment * rng.normal(1.0, 0.03)

        rows.append(feature_row)
        targets.append(float(max(target, baseline_total * 0.72)))

    return pd.DataFrame(rows, columns=MODEL_FEATURES), np.array(targets)


@lru_cache(maxsize=1)
def _get_estimation_model() -> RandomForestRegressor:
    training_x, training_y = _build_training_dataset()
    model = RandomForestRegressor(
        n_estimators=160,
        max_depth=10,
        min_samples_leaf=2,
        random_state=42,
    )
    model.fit(training_x, training_y)
    logger.info("Initialized organizational analyzer estimation model")
    return model


def _estimate_total_emissions(activity_totals: dict[str, float]) -> tuple[float, float]:
    feature_frame = _build_feature_frame(activity_totals)
    model = _get_estimation_model()

    individual_predictions = np.array(
        [estimator.predict(feature_frame)[0] for estimator in model.estimators_],
        dtype=float,
    )
    predicted_total = float(individual_predictions.mean())
    baseline_total = float(feature_frame["baseline_total"].iloc[0])

    # Keep the estimate close to the activity-based baseline while still reflecting model variance.
    predicted_total = max(predicted_total, baseline_total * 0.85)
    predicted_total = min(predicted_total, baseline_total * 1.35)

    relative_std = float(np.std(individual_predictions) / max(predicted_total, 1e-6))
    confidence_score = float(np.clip(0.97 - relative_std * 3.2, 0.71, 0.96))
    return round(predicted_total, 2), round(confidence_score, 2)


def _build_category_breakdown(activity_totals: dict[str, float], total_emissions: float) -> list[dict[str, float | str]]:
    baseline_categories = _get_baseline_category_emissions(activity_totals)
    baseline_total = sum(baseline_categories.values()) or 1.0
    scaling_factor = total_emissions / baseline_total
    breakdown: list[dict[str, float | str]] = []

    for category, meta in CATEGORY_META.items():
        emissions = baseline_categories[category] * scaling_factor
        share = emissions / max(total_emissions, 1e-6)
        breakdown.append(
            {
                "category": category,
                "label": meta["label"],
                "emissions": round(emissions, 2),
                "share": round(share * 100, 1),
                "color": meta["color"],
            }
        )

    breakdown.sort(key=lambda item: float(item["emissions"]), reverse=True)
    return breakdown


def _build_insights(
    total_emissions: float,
    activity_totals: dict[str, float],
    breakdown: list[dict[str, float | str]],
) -> list[dict[str, str]]:
    employees = max(activity_totals["employee_count"], 1.0)
    emissions_per_employee = total_emissions / employees
    transport_share = next(
        float(item["share"]) for item in breakdown if item["category"] == "transport"
    )
    energy_share = next(float(item["share"]) for item in breakdown if item["category"] == "energy")
    waste_share = next(float(item["share"]) for item in breakdown if item["category"] == "waste")

    insights = [
        {
            "title": "Organizational footprint baseline",
            "summary": (
                f"The uploaded dataset translates to an estimated {total_emissions:.2f} tCO2e, "
                f"or {emissions_per_employee:.2f} tCO2e per employee."
            ),
            "priority": "High" if emissions_per_employee > 8 else "Medium",
        }
    ]

    if energy_share >= 30:
        insights.append(
            {
                "title": "Electricity usage is the primary driver",
                "summary": (
                    f"Energy-related activity contributes {energy_share:.1f}% of estimated emissions, "
                    "which suggests building efficiency and power procurement will have the largest reduction impact."
                ),
                "priority": "High",
            }
        )

    if transport_share >= 20:
        insights.append(
            {
                "title": "Mobility emissions are materially elevated",
                "summary": (
                    f"Transport makes up {transport_share:.1f}% of the total footprint. Fleet utilization, "
                    "route planning, and travel policy changes are likely to reduce emissions quickly."
                ),
                "priority": "High",
            }
        )

    if waste_share >= 10:
        insights.append(
            {
                "title": "Waste stream optimization is worth targeting",
                "summary": (
                    f"Waste-related emissions account for {waste_share:.1f}% of the footprint, indicating "
                    "that segregation, recycling, and vendor controls can produce measurable gains."
                ),
                "priority": "Medium",
            }
        )

    return insights


def _build_recommendations(
    breakdown: list[dict[str, float | str]],
    activity_totals: dict[str, float],
) -> list[dict[str, str]]:
    recommendations: list[dict[str, str]] = []
    top_categories = {str(item["category"]): item for item in breakdown[:3]}
    employees = max(activity_totals["employee_count"], 1.0)

    if "energy" in top_categories:
        recommendations.append(
            {
                "title": "Shift electricity demand to cleaner power",
                "category": "Energy",
                "impact": "High",
                "description": (
                    "Prioritize renewable power contracts, HVAC retrofits, and load-shifting for major facilities "
                    "to reduce Scope 2 exposure from electricity consumption."
                ),
            }
        )

    if "fuel" in top_categories or "transport" in top_categories:
        recommendations.append(
            {
                "title": "Reduce operational fuel and mobility intensity",
                "category": "Transport",
                "impact": "High",
                "description": (
                    "Electrify the most predictable routes first, consolidate vehicle trips, and use telematics or route "
                    "optimization to cut idle time and fuel burn."
                ),
            }
        )

    if "waste" in top_categories:
        recommendations.append(
            {
                "title": "Implement waste diversion controls",
                "category": "Waste",
                "impact": "Medium",
                "description": (
                    "Introduce waste segregation, vendor recycling SLAs, and source reduction programs for high-volume "
                    "materials to reduce landfill-linked emissions."
                ),
            }
        )

    recommendations.append(
        {
            "title": "Track emissions intensity per employee",
            "category": "Governance",
            "impact": "Medium",
            "description": (
                f"Use {activity_totals['employee_count']:.0f} employees as a baseline and monitor tCO2e per employee "
                "monthly to spot operational drift early and guide budgeting decisions."
            ),
        }
    )

    return recommendations[:4]


def analyze_organization_dataframe(df: pd.DataFrame, file_name: str) -> dict[str, object]:
    validated_df = _validate_dataframe(df)
    row_count = int(len(validated_df))

    activity_totals = {
        column: float(validated_df[column].sum())
        for column in REQUIRED_COLUMNS
    }
    total_emissions, confidence_score = _estimate_total_emissions(activity_totals)
    category_breakdown = _build_category_breakdown(activity_totals, total_emissions)
    insights = _build_insights(total_emissions, activity_totals, category_breakdown)
    recommendations = _build_recommendations(category_breakdown, activity_totals)

    emissions_per_employee = round(
        total_emissions / max(activity_totals["employee_count"], 1.0),
        2,
    )
    key_contributors = [str(item["label"]) for item in category_breakdown[:3]]

    return {
        "file_name": file_name,
        "rows_processed": row_count,
        "required_fields": REQUIRED_COLUMNS,
        "activity_totals": {key: round(value, 2) for key, value in activity_totals.items()},
        "total_emissions": total_emissions,
        "unit": "tCO2e",
        "confidence_score": confidence_score,
        "emissions_per_employee": emissions_per_employee,
        "category_breakdown": category_breakdown,
        "intensity_metrics": [
            {"label": "Emissions / Employee", "value": emissions_per_employee},
            {
                "label": "Electricity / Employee",
                "value": round(activity_totals["electricity_kwh"] / max(activity_totals["employee_count"], 1.0), 2),
            },
            {
                "label": "Transport / Employee",
                "value": round(activity_totals["transport_km"] / max(activity_totals["employee_count"], 1.0), 2),
            },
        ],
        "key_contributors": key_contributors,
        "insights": insights,
        "recommendations": recommendations,
        "report": {
            "summary": (
                f"{file_name} contains {row_count} records and an estimated total footprint of "
                f"{total_emissions:.2f} tCO2e."
            ),
            "key_contributors": key_contributors,
            "recommendations": [item["title"] for item in recommendations],
            "narrative": (
                "The AI-assisted estimate combines recognized activity emission factors with a calibrated "
                "ensemble model to reflect operational intensity across energy, mobility, waste, and workforce data."
            ),
        },
    }


def analyze_organization_csv(uploaded_file) -> dict[str, object]:
    try:
        dataframe = pd.read_csv(uploaded_file)
    except pd.errors.EmptyDataError as exc:
        raise ValueError("The uploaded CSV file is empty.") from exc
    except Exception as exc:
        raise ValueError("Unable to read the CSV file. Please upload a valid CSV document.") from exc

    file_name = getattr(uploaded_file, "filename", "organization-activity.csv")
    logger.info("Processing organization analyzer CSV: %s", file_name)
    return analyze_organization_dataframe(dataframe, file_name)
