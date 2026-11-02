using Xunit;
using Core.Physics;
using System;

namespace Core.Tests
{
    public class SimulatirTests
    {
        [Fact]
        public void Parser_ShouldCalculateEquationCorrectly()
        {
            var parser=new EquationParser();
            string equation = "2*t+0.2*t*t";
            double t = 2.0;

            var expr = parser.Parser(equation);
            double result = expr.Eval(t);

            Assert.Equal(4.8, result, 3);
        }

        [Fact]
        public void Check_ShouldFindCollision_WhenCarsMoveTowardEachOther()
        {
            var simulator = new Simulator();
            string leftEq = "2*t";
            string righgtEq = "10-3*t";

            var result=simulator.Check(leftEq, righgtEq,0,10,1.0);

            Assert.True(result.IsValid);
            Assert.True(result.WillCollide);
            Assert.Equal(1.8, result.PredictedCollisionTime.Value, 3);
        }
        [Fact]
        public void Check_ShouldReject_WhenCarsMoveInSameDirection()
        {
            var simulator=new Simulator();
            string leftEq = "2*t";
            string rightEq = "5+3*t";

            var result=simulator.Check(leftEq, rightEq,0,10,1.0);

            Assert.False(result.IsValid);
            Assert.False(result.WillCollide);
            Assert.Contains("одну сторону", result.ErrorMessage);
        }
    }
}
