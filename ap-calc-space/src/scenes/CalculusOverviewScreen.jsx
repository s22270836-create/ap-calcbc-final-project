import units from "../dataset/units";

export default function CalculusOverviewScreen({ onBack }) {

  return (
    <div className="overview-screen">

      <div className="overview-header">

        <h1>
          AP CALCULUS BC OVERVIEW
        </h1>

        <button
          className="back-button"
          onClick={onBack}
        >
          BACK
        </button>

      </div>

      <div className="overview-grid">

        {units.map((item) => (
          <div
            key={item.unit}
            className="overview-card"
          >

            <h2>
              UNIT {item.unit}
            </h2>

            <h3>
              {item.topic}
            </h3>

            <p>
              {getDescription(item.unit)}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

function getDescription(unit) {
  switch (unit) {
    case 1:
      return "Analyze temperature boundaries and long-term convergence trends using limits and continuity models.";
    case 2:
      return "Determine instantaneous rates of change for meteorological data and establish conditions for differentiability.";
    case 3:
      return "Apply the Chain Rule and implicit differentiation to model correlations between energy consumption and temperature.";
    case 4:
      return "Utilize related rates to predict reservoir levels and derive linear approximations for climate data.";
    case 5:
      return "Optimize power load performance by identifying local extrema and inflection points in supply functions.";
    case 6:
      return "Calculate accumulated energy reserves using Riemann sums and the Fundamental Theorem of Calculus.";
    case 7:
      return "Solve separable differential equations to forecast power supply growth and interpret slope field behavior.";
    case 8:
      return "Compute geographic areas and volumes of solids of revolution to map infrastructure and coastal radar surveillance.";
    case 9:
      return "Simulate drone trajectories and polar echo domains using parametric equations and vector-valued functions.";
    case 10:
      return "Construct Taylor polynomials to approximate complex data trends and evaluate the error of prediction models.";
    default:
      return "";
  }
}