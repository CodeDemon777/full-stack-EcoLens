import { useState } from "react";
import { TrendingUp, AlertTriangle, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE } from "@/lib/api";

const FEATURE_ORDER = [
  "population",
  "gdp",
  "primary_energy_consumption",
  "energy_per_capita",
  "energy_per_gdp"
];

const DEFAULT_FEATURES: Record<string, string> = {
  "population": "1400000000",
  "gdp": "3000000000000",
  "primary_energy_consumption": "35000",
  "energy_per_capita": "25000",
  "energy_per_gdp": "1.5"
};

const Predictions = () => {
    
  // Sub-tabs to manage the 3 components easily
  const [activeTab, setActiveTab] = useState<"predict" | "simulate" | "forecast">("predict");

  // PREDICTION STATE
  const [features, setFeatures] = useState<Record<string, string>>(DEFAULT_FEATURES);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // SIMULATOR STATE
  const [scenarioOverrides, setScenarioOverrides] = useState({
      gdp: 3500000000000,
      primary_energy_consumption: 40000,
      energy_per_capita: 28000
  });
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // FORECAST STATE
  const [forecastForm, setForecastForm] = useState({ country: "India", start_year: "2025", end_year: "2035" });
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastError, setForecastError] = useState("");

  const handleFeatureChange = (f: string, val: string) => {
      setFeatures(prev => ({ ...prev, [f]: val }));
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setPredictionResult(null);
    try {
        const numFeatures = Object.fromEntries(Object.entries(features).map(([k, v]) => [k, Number(v)]));
        const res = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(numFeatures)
        });
        const data = await res.json();
        if(data.success) {
            setPredictionResult(data.data);
        } else {
             alert(data.error?.message || "Prediction failed");
        }
    } catch(err) {
        console.error(err);
        alert("Failed to connect to backend");
    } finally {
        setIsPredicting(false);
    }
  };

  const handleSimulate = async () => {
      setIsSimulating(true);
      setSimulationResult(null);
      try {
        const numBase = Object.fromEntries(Object.entries(features).map(([k, v]) => [k, Number(v)]));
        const reqData = {
            base_features: numBase,
            scenario_overrides: scenarioOverrides
        };
        const res = await fetch(`${API_BASE}/simulate`, {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(reqData)
        });
        const data = await res.json();
        if(data.success) {
             setSimulationResult(data.data);
        } else {
             alert(data.error?.message || "Simulation failed");
        }
      } catch(e) {
         console.error(e);
      } finally {
         setIsSimulating(false);
      }
  };

  const handleForecast = async () => {
     setIsForecasting(true);
     setForecastError("");
     try {
         const res = await fetch(`${API_BASE}/forecast`, {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country: forecastForm.country,
                start_year: Number(forecastForm.start_year),
                end_year: Number(forecastForm.end_year)
            })
        });
        const data = await res.json();
        if(data.success) {
             setForecastData(data.data);
        } else {
             setForecastError(data.error?.message || "Forecast failed.");
        }
     } catch(e) {
         console.error(e);
         setForecastError("Failed to connect to backend");
     } finally {
         setIsForecasting(false);
     }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Advanced Analytics & Predictions</h1>
        <p className="text-sm text-muted-foreground">End-to-end ML integration with Random Forest Regressor & Prophet</p>
      </div>

      <div className="flex space-x-4 border-b border-border pb-2">
           <button onClick={() => setActiveTab('predict')} className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'predict' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}>Predict Emissions</button>
           <button onClick={() => setActiveTab('simulate')} className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'simulate' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}>Scenario Simulator</button>
           <button onClick={() => setActiveTab('forecast')} className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'forecast' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'}`}>Time-Series Forecast</button>
      </div>

      {/* --- PREDICT TAB --- */}
      {activeTab === 'predict' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-display font-semibold mb-4 text-lg">Input 16 Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {FEATURE_ORDER.map(f => (
                        <div key={f} className="flex flex-col gap-1.5">
                            <label className="text-xs text-muted-foreground font-medium truncate" title={f}>{f.replace(/_/g, ' ')}</label>
                            <input 
                               type="number" 
                               step="any"
                               className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                               value={features[f]}
                               onChange={(e) => handleFeatureChange(f, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button 
                  onClick={handlePredict} 
                  disabled={isPredicting}
                  className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 flex justify-center items-center gap-2"
                >
                    {isPredicting ? <><Loader2 className="animate-spin h-5 w-5" /> Processing Models...</> : "Run Prediction"}
                </button>
            </div>

            <div className="space-y-6">
                 {predictionResult ? (
                     <div className="animate-slide-up">
                         {predictionResult.anomaly?.is_anomaly && (
                             <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-xl flex items-start gap-3 mb-4">
                                 <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                                 <div>
                                     <h4 className="font-bold text-sm">Anomaly Warning</h4>
                                     <p className="text-sm mt-1">{predictionResult.anomaly.message} (Score: {predictionResult.anomaly.anomaly_score.toFixed(2)})</p>
                                 </div>
                             </div>
                         )}
                         <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center">
                             <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Predicted CO₂ Output</p>
                             <div className="flex items-baseline gap-2">
                                <h2 className="font-display text-5xl font-black text-foreground">{predictionResult.carbon_footprint.toFixed(2)}</h2>
                                <span className="text-lg text-muted-foreground font-medium">{predictionResult.unit}</span>
                             </div>
                             
                             <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-bold border 
                                 ${predictionResult.category === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                   predictionResult.category === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                   'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                 {predictionResult.category} Risk Category
                             </div>
                             <p className="text-xs text-muted-foreground mt-4">Confidence Score: {(predictionResult.confidence_score * 100).toFixed(0)}%</p>
                         </div>
                     </div>
                 ) : (
                     <div className="h-full bg-accent/5 border border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground">
                         <TrendingUp className="h-12 w-12 opacity-20 mb-4" />
                         <p>Fill in features and run prediction</p>
                     </div>
                 )}
            </div>
        </div>
      )}

      {/* --- SIMULATE TAB --- */}
      {activeTab === 'simulate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-semibold mb-2 text-lg">Scenario Adjustments</h3>
                  <p className="text-xs text-muted-foreground mb-6">Modify these key macro variables to see how emissions respond.</p>
                  
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-sm font-medium flex justify-between">
                              GDP ($)
                              <span className="text-primary font-bold">${(scenarioOverrides.gdp/1e9).toFixed(1)}B</span>
                          </label>
                          <input type="range" min="1000000000" max="30000000000000" step="1000000000" 
                             className="w-full accent-primary" 
                             value={scenarioOverrides.gdp}
                             onChange={(e) => setScenarioOverrides(p => ({...p, gdp: Number(e.target.value)}))}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium flex justify-between">
                              Primary Energy Cons.
                              <span className="text-primary font-bold">{scenarioOverrides.primary_energy_consumption}</span>
                          </label>
                          <input type="range" min="1000" max="100000" step="500" 
                             className="w-full accent-primary" 
                             value={scenarioOverrides.primary_energy_consumption}
                             onChange={(e) => setScenarioOverrides(p => ({...p, primary_energy_consumption: Number(e.target.value)}))}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium flex justify-between">
                              Energy Per Capita
                              <span className="text-primary font-bold">{scenarioOverrides.energy_per_capita}</span>
                          </label>
                          <input type="range" min="100" max="50000" step="100" 
                             className="w-full accent-primary" 
                             value={scenarioOverrides.energy_per_capita}
                             onChange={(e) => setScenarioOverrides(p => ({...p, energy_per_capita: Number(e.target.value)}))}
                          />
                      </div>
                  </div>

                  <button 
                      onClick={handleSimulate} 
                      disabled={isSimulating}
                      className="mt-8 w-full py-3 bg-secondary text-secondary-foreground border border-border rounded-lg font-semibold hover:bg-secondary/80 flex justify-center items-center gap-2"
                  >
                      {isSimulating ? <><Loader2 className="animate-spin h-5 w-5" /> Simulating...</> : "Run Macro Simulation"}
                  </button>
              </div>

              <div className="space-y-6">
                  {simulationResult ? (
                       <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col h-full animate-slide-up">
                            <h3 className="font-display font-semibold text-lg border-b border-border pb-4 mb-6">Simulation Results</h3>
                            
                            <div className="flex justify-between items-end mb-8">
                                 <div>
                                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Baseline Profile</p>
                                      <p className="text-3xl font-bold">{simulationResult.baseline_co2.toFixed(1)} <span className="text-sm text-muted-foreground">MtCO2</span></p>
                                 </div>
                                 <div className="h-10 border-r border-border mx-4"></div>
                                 <div className="text-right">
                                      <p className="text-xs text-primary uppercase font-semibold mb-1">Scenario Outcome</p>
                                      <p className="text-3xl font-bold">{simulationResult.scenario_co2.toFixed(1)} <span className="text-sm text-muted-foreground">MtCO2</span></p>
                                 </div>
                            </div>

                            <div className={`mt-auto p-4 rounded-lg flex items-center justify-between
                                ${simulationResult.delta < 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                <div className="flex items-center gap-2 font-bold">
                                    {simulationResult.delta < 0 ? <ArrowDown className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />}
                                    {abs(simulationResult.delta).toFixed(2)} MtCO2 Change
                                </div>
                                <div className="font-bold text-lg">
                                    {simulationResult.delta < 0 ? "-" : "+"}{abs(simulationResult.delta_percent).toFixed(1)}%
                                </div>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-4">{simulationResult.interpretation}</p>
                       </div>
                  ) : (
                       <div className="h-full bg-accent/5 border border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground">
                         <p>Adjust levers and run simulation to compare</p>
                       </div>
                  )}
              </div>
          </div>
      )}

      {/* --- FORECAST TAB --- */}
      {activeTab === 'forecast' && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in fade-in">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Country</label>
                      <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" 
                             value={forecastForm.country} onChange={(e) => setForecastForm(p => ({...p, country: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">From Year</label>
                      <input type="number" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" 
                             value={forecastForm.start_year} onChange={(e) => setForecastForm(p => ({...p, start_year: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">To Year</label>
                      <input type="number" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" 
                             value={forecastForm.end_year} onChange={(e) => setForecastForm(p => ({...p, end_year: e.target.value}))} />
                  </div>
                  <div className="flex items-end">
                      <button 
                          onClick={handleForecast} 
                          disabled={isForecasting}
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-bold h-[38px] flex justify-center items-center gap-2 hover:opacity-90"
                      >
                          {isForecasting ? <Loader2 className="animate-spin h-4 w-4" /> : "Run Forecast"}
                      </button>
                  </div>
              </div>

              {forecastError && (
                  <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md mb-6">{forecastError}</div>
              )}

              {forecastData.length > 0 ? (
                  <div className="h-[400px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorYhat" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            formatter={(value: number) => [value.toFixed(2), "MtCO2"]}
                          />
                          <Area type="monotone" dataKey="upper_bound" stroke="none" fill="hsl(var(--muted))" fillOpacity={0.5} name="Upper Bound" />
                          <Area type="monotone" dataKey="lower_bound" stroke="none" fill="hsl(var(--background))" fillOpacity={1} name="Lower Bound" />
                          <Area type="monotone" dataKey="predicted_co2" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorYhat)" name="Predicted" />
                        </AreaChart>
                      </ResponsiveContainer>
                  </div>
              ) : (
                  <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg text-muted-foreground text-sm">
                      Enter parameters to generate time-series forecast using Prophet
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

// Math helper
const abs = Math.abs;

export default Predictions;
