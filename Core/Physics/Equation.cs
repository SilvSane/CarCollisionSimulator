using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Physics
{
    internal class Equation
    {
        
    }

    public abstract class Expr
    {
        public abstract double Eval(double t);
    }

    public class Negate : Expr
    {
        public Expr Inner;

        public Negate(Expr inner)
        {
            Inner = inner;
        }
        public override double Eval(double t)
        {
            return -Inner.Eval(t);
        }
        
    }
    public class Const : Expr
    {
        public double Value;
        public Const(double value) { Value = value; }
        public override double Eval(double t) => Value;
    }

    public class VarT : Expr
    {
        public override double Eval(double t) => t;
    }

    public class BinOp : Expr
    {
        public Expr Left;
        public Expr Right;
        public char Op;

        public BinOp(Expr left, Expr right, char op)
        {
            Left = left;
            Right = right;
            Op = op;
        }

        public override double Eval(double t)
        {
            double a=Left.Eval(t);
            double b=Right.Eval(t);
            switch (Op)
            {
                case '+':
                    return a + b;
                case '-':
                    return a - b;
                case '*':
                    return a * b;
                case '/':
                    return a / b;
                case '^':
                    return Math.Pow(a, b);
                default:
                    throw new Exception("Неизв. опер:"+Op);

            }
        }
    }

}
