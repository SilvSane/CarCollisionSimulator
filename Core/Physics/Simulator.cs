using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Physics
{
    internal class Simulator
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
        public class Simulator_1
        {
            private readonly EquationParser _parser = new EquationParser();

            //Проверка уравнений  
            public CheckResult Check(string leftEq, string rightEq,
                                     double leftStart, double rightStart, double carWidth)
            {
                var result = new CheckResult();

                Expr leftExpr, rightExpr;

                // Пытаемся разобрать левое    
                try { leftExpr = _parser.Parser(leftEq); }
                catch (Exception ex)
                {
                    result.ErrorMessage = "Ошибка в левом уравнении: " + ex.Message;
                    result.LeftDirection = "unknown";
                    result.RightDirection = "unknown";
                    return result;
                }

                // Пытаемся разобрать правое    
                try { rightExpr = _parser.Parser(rightEq); }
                catch (Exception ex)
                {
                    result.ErrorMessage = "Ошибка в правом уравнении: " + ex.Message;
                    result.LeftDirection = "unknown";
                    result.RightDirection = "unknown";
                    return result;
                }

                // Определяем направление     
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

                // Mомент столкновения    
                double collision = FindCollision(leftExpr, rightExpr, leftStart, rightStart, carWidth, 0.001);

                if (collision < 0)
                {
                    result.ErrorMessage = "При таких начальных позициях столкновения не произойдёт";
                    return result;
                }

                result.IsValid = true;
                result.WillCollide = true;
                result.PredictedCollisionTime = collision;
                result.ErrorMessage = "";
                return result;
            }
            public SimResult Run(SimInput input)
            {
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
                    samples.Add(new SimSample
                    {
                        T = t,
                        Left = input.LeftStart + leftExpr.Eval(t),
                        Right = input.RightStart + rightExpr.Eval(t)
                    });
                }

                // Добавляем финальную точку     
                samples.Add(new SimSample
                {
                    T = collisionTime,
                    Left = input.LeftStart + leftExpr.Eval(collisionTime),
                    Right = input.RightStart + rightExpr.Eval(collisionTime)
                });

                var last = samples[samples.Count - 1];

                double leftDistance = Math.Abs(last.Left - input.LeftStart);
                double rightDistance = Math.Abs(input.RightStart - last.Right);
                double duration = last.T;

                return new SimResult
                {
                    Dt = input.Dt,
                    CollisionTime = collisionTime,
                    CarWidth = input.CarWidth,
                    LeftStart = input.LeftStart,
                    RightStart = input.RightStart,
                    Samples = samples,
                    Duration = duration,
                    LeftAvgSpeed = leftDistance / duration,
                    LeftDistance = leftDistance,
                    LeftDirection = "right",
                    RightAvgSpeed = -rightDistance / duration,
                    RightDistance = rightDistance,
                    RightDirection = "left"
                };
            }
            // Определяем направление: смотрим, растёт x или падает.    
              
            private string DetermineDirection(Expr expr)
            {
                double dt = 0.01;
                double x0 = expr.Eval(0);
                double x1 = expr.Eval(dt);
                if (x1 > x0) return "right";
                if (x1 < x0) return "left";
                return "unknown";
            }

            // Ищем момент, когда машины встретятся.       
            private double FindCollision(Expr left, Expr right,
                                         double leftStart, double rightStart,
                                         double carWidth, double step)
            {
                for (double t = 0; t < 1000; t += step)
                {
                    double l = leftStart + left.Eval(t);
                    double r = rightStart + right.Eval(t);
                    if (r - l <= carWidth)
                        return t;
                }
                return -1;
            }
        }

    }
}
