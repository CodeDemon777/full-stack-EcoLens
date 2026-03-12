from flask import Blueprint, request

from models.organization_analyzer import analyze_organization_csv
from utils.logger import logger
from utils.response import error_response, success_response

organization_bp = Blueprint("organization", __name__)


@organization_bp.route("/organization-analyzer/upload", methods=["POST"])
def upload_organization_csv():
    try:
        uploaded_file = request.files.get("file")
        if uploaded_file is None or uploaded_file.filename == "":
            return error_response("Please upload a CSV file.", 400)

        if not uploaded_file.filename.lower().endswith(".csv"):
            return error_response("Only CSV uploads are supported.", 400)

        result = analyze_organization_csv(uploaded_file)
        return success_response(result)
    except ValueError as exc:
        logger.warning("Organization analyzer validation failed: %s", exc)
        return error_response(str(exc), 400)
    except Exception as exc:
        logger.error("Organization analyzer upload failed: %s", exc)
        return error_response("The organization analyzer failed to process the CSV file.", 500)
