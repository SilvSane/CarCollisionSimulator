using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Physics
{

    public class SimInput
    {
        public string LeftEquation = "";
        public string RightEquation = "";
        public double LeftStart;
        public double RightStart;
        public double CarWidth;
        public double Dt;
    }

    public class SimSample
    {
        public double T;
        public double Left;
        public double Right;
    }

    public class SimResult
    {
        public double Dt;
        public double CollisionTime;
        public double CarWidth;
        public double LeftStart;
        public double RightStart;
        public List<SimSample> Samples = new List<SimSample>();
        public double Duration;
        public double LeftAvgSpeed;
        public double LeftDistance;
        public string LeftDirection = "";
        public double RightAvgSpeed;
        public double RightDistance;
        public string RightDirection = "";
    }
    public class CheckResult
    {
        public bool IsValid;
        public string LeftDirection = "";
        public string RightDirection = "";
        public bool WillCollide;
        public double? PredictedCollisionTime;
        public string ErrorMessage = "";     // пустая строка, если всё ок    
    }
    public class Simulator
    {
        private readonly EquationParser _parser = new EquationParser();

        private void ValidateInput(SimInput input)
        {
            if (input.Dt <= 0) throw new Exception("Шаг времени больше нуля надо");
            if (input.CarWidth <= 0) throw new Exception("Ширина машины больше нуля надо");
            if (string.IsNullOrWhiteSpace(input.LeftEquation) || string.IsNullOrWhiteSpace(input.RightEquation)) throw new Exception("Уравнение не пустое должно быть");
        }

        //Проверка уравнений  
        public CheckResult Check(string leftEq, string rightEq,
                                 double leftStart, double rightStart, double carWidth)
        {
            var result = new CheckResult();

            var tempInput = new SimInput
            {
                LeftEquation = leftEq,
                RightEquation = rightEq,
                LeftStart = leftStart,
                RightStart = rightStart,
                CarWidth = carWidth,
                Dt = 0.1    
            };

            // Пытаемся разобрать левое    
            try
            {
                ValidateInput(tempInput);
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.Message;
                result.LeftDirection = "unknown";
                result.RightDirection = "unknown";
                return result;
            }
            Expr leftExpr, rightExpr;

            // Пытаемся разобрать правое    
            try
            {
                leftExpr = _parser.Parser(leftEq);
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Ошибка в левом уравнении: " + ex.Message;
                result.LeftDirection = "unknown";
                result.RightDirection = "unknown";
                return result;
            }


            try { rightExpr = _parser.Parser(rightEq); }
            catch (Exception ex)
            {
                result.ErrorMessage = "Ошибка в правом уравнении: " + ex.Message;
                result.LeftDirection = "unknown";
                result.RightDirection = "unknown";
                return result;
            }


            result.LeftDirection = DetermineDirection(leftExpr);
            result.RightDirection = DetermineDirection(rightExpr);


            if (result.LeftDirection == "unknown" || result.RightDirection == "unknown")
            {
                result.ErrorMessage = "Не удалось определить направление движения";
                return result;
            }

            if (result.LeftDirection == result.RightDirection)
            {
                result.ErrorMessage = "Обе машины движутся в одну сторону — столкновения не будет";
                return result;
            }

            // Ищем столкновение   
            double collision = FindCollision(leftExpr, rightExpr, leftStart, rightStart, carWidth, 0.001);

            if (collision < 0)
            {
                result.ErrorMessage = "При таких начальных позициях столкновения не произойдёт";
                return result;
            }




            result.IsValid = true;
            result.WillCollide = true;
            result.PredictedCollisionTime = Math.Round(collision, 4);  
            result.ErrorMessage = "";
            return result;

        }


        public SimResult Run(SimInput input)
        {
            ValidateInput(input);

            var leftExpr = _parser.Parser(input.LeftEquation);
            var rightExpr = _parser.Parser(input.RightEquation);


            double collisionTime = FindCollision(
                leftExpr, rightExpr,
                input.LeftStart, input.RightStart,
                input.CarWidth, 0.001);

            if (collisionTime < 0)
                throw new Exception("Столкновение не найдено");

            var samples = new List<SimSample>();
            for (double t = 0; t < collisionTime; t += input.Dt)
            {
                if (samples.Count > 100000) throw new Exception("Слишком много всего ");

                samples.Add(new SimSample
                {
                    T = Math.Round(t,4),
                    Left = Math.Round(leftExpr.Eval(t),4),
                    Right = Math.Round(rightExpr.Eval(t),4)
                });
            }


            samples.Add(new SimSample
            {
                T = Math.Round(collisionTime,4),
                Left = Math.Round(leftExpr.Eval(collisionTime),4),
                Right = Math.Round(rightExpr.Eval(collisionTime),4)
            });

            var last = samples[samples.Count - 1];

            double leftDistance = Math.Abs(last.Left -leftExpr.Eval(0));
            double rightDistance = Math.Abs(rightExpr.Eval(0) - last.Right);
            double duration = last.T;

            return new SimResult
            {
                Dt = input.Dt,
                CollisionTime = Math.Round(collisionTime,4),
                CarWidth = input.CarWidth,
                LeftStart = Math.Round(leftExpr.Eval(0), 4),
                RightStart = Math.Round(rightExpr.Eval(0), 4),
                Samples = samples,
                Duration = Math.Round(duration, 4),
                LeftAvgSpeed = Math.Round(leftDistance / duration,4),
                LeftDistance = Math.Round(leftDistance, 4),
                LeftDirection = "right",
                RightAvgSpeed = Math.Round(-rightDistance / duration, 4),
                RightDistance = Math.Round(rightDistance, 4),
                RightDirection = "left"
            };
        }


        private string DetermineDirection(Expr expr)
        {
            double dt = 0.01;
            double x0 = expr.Eval(0);
            double x1 = expr.Eval(dt);
            if (x1 > x0) return "right";
            if (x1 < x0) return "left";
            return "unknown";
        }


        private double FindCollision(Expr left, Expr right,
                                     double leftStart, double rightStart,
                                     double carWidth, double step)
        {
            for (double t = 0; t < 1000; t += step)
            {
                double l = left.Eval(t);
                double r = right.Eval(t);

                if (r - l <= carWidth)
                    return t;
            }
            return -1;
        }
    }
}


