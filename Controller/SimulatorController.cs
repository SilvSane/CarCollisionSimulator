using Core.Physics;
using Microsoft.AspNetCore.Mvc;
using static Core.Physics.Simulator;

namespace Controller
{

    public class EquationsIn
    {
        public string Left { get; set; } = "";
        public string Right { get; set; } = "";
    }

    public class PositionsIn
    {
        public double Left { get; set; }
        public double Right { get; set; }
    }

    public class CheckIn
    {
        public EquationsIn Equations { get; set; } = new EquationsIn();
        public PositionsIn InitialPositions { get; set; } = new PositionsIn();
        public double CarWidth { get; set; }
    }

    public class RunIn
    {
        public EquationsIn Equations { get; set; } = new EquationsIn();
        public PositionsIn InitialPositions { get; set; } = new PositionsIn();
        public double CarWidth { get; set; }
        public double Dt { get; set; }
    }

    public class DirectionsOut
    {
        public string Left { get; set; } = "";
        public string Right { get; set; } = "";
    }

    public class CheckOut
    {
        public bool IsValid { get; set; }
        public DirectionsOut Directions { get; set; } = new DirectionsOut();
        public bool WillCollide { get; set; }
        public double? PredictedCollisionTime { get; set; }
        public List<object> Errors { get; set; } = new List<object>();
    }

    public class MetaOut
    {
        public double Dt { get; set; }
        public double CollisionTime { get; set; }
        public double CarWidth { get; set; }
        public PositionsIn InitialPositions { get; set; } = new PositionsIn();
    }

    public class SampleOut
    {
        public double T { get; set; }
        public double Left { get; set; }
        public double Right { get; set; }
    }

    public class CarStatsOut
    {
        public double AverageSpeed { get; set; }
        public double Distance { get; set; }
        public string Direction { get; set; } = "";
    }

    public class StatsOut
    {
        public double Duration { get; set; }
        public double CollisionTime { get; set; }
        public CarStatsOut Left { get; set; } = new CarStatsOut();
        public CarStatsOut Right { get; set; } = new CarStatsOut();
    }

    public class RunOut
    {
        public MetaOut Meta { get; set; } = new MetaOut();
        public List<SampleOut> Samples { get; set; } = new List<SampleOut>();
        public StatsOut Statistics { get; set; } = new StatsOut();
    }


    [ApiController]
    [Route("api/simulate")]
    public class SimulatorController : ControllerBase
    {
        private readonly Simulator _simulator = new Simulator();

        [HttpPost("check")] 
        public IActionResult Check([FromBody] CheckIn input)
        {
            var r = _simulator.Check(
                input.Equations.Left,
                input.Equations.Right,
                input.InitialPositions.Left,
                input.InitialPositions.Right,
                input.CarWidth);

            var response = new CheckOut
            {
                IsValid = r.IsValid,
                WillCollide = r.WillCollide,
                PredictedCollisionTime = r.PredictedCollisionTime,
                Directions = new DirectionsOut
                {
                    Left = r.LeftDirection,
                    Right = r.RightDirection
                }
            };

            if (!string.IsNullOrEmpty(r.ErrorMessage))
            {
                response.Errors.Add(new
                {
                    code = "VALIDATION_ERROR",
                    field = "both",
                    message = r.ErrorMessage
                });
            }

            return Ok(response);
        }

        [HttpPost("run")]
        public IActionResult Run([FromBody] RunIn input)
        {
            try
            {
                var simInput = new SimInput
                {
                    LeftEquation = input.Equations.Left,
                    RightEquation = input.Equations.Right,
                    LeftStart = input.InitialPositions.Left,
                    RightStart = input.InitialPositions.Right,
                    CarWidth = input.CarWidth,
                    Dt = input.Dt
                };

                var r = _simulator.Run(simInput);

                var response = new RunOut
                {
                    Meta = new MetaOut
                    {
                        Dt = r.Dt,
                        CollisionTime = r.CollisionTime,
                        CarWidth = r.CarWidth,
                        InitialPositions = new PositionsIn
                        {
                            Left = r.LeftStart,
                            Right = r.RightStart
                        }
                    },
                    Statistics = new StatsOut
                    {
                        Duration = r.Duration,
                        CollisionTime = r.CollisionTime,
                        Left = new CarStatsOut
                        {
                            AverageSpeed = r.LeftAvgSpeed,
                            Distance = r.LeftDistance,
                            Direction = r.LeftDirection
                        },
                        Right = new CarStatsOut
                        {
                            AverageSpeed = r.RightAvgSpeed,
                            Distance = r.RightDistance,
                            Direction = r.RightDirection
                        }
                    }
                };

                foreach (var s in r.Samples)
                {
                    response.Samples.Add(new SampleOut
                    {
                        T = s.T,
                        Left = s.Left,
                        Right = s.Right
                    });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
    
}
