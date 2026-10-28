using System;
using System.Collections.Generic;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;

namespace Core.Physics
{
    public class EquationParser
    {
        private string _s = "";
        private int _pos = 0;

        public Expr Parser(string input)
        {
            _s = Normalize(input);
            _pos = 0;

            var result = ParseExpression();

            if (_pos < _s.Length)
                throw new Exception($"Лишние символы в конце: {_s.Substring(_pos)}");

            return result;
        }

        private string Normalize(string input)
        {
            string s = input.Replace(" ","").Replace(",",".");

            s = s.Replace("**", "^");
            s = s.Replace("t*t", "t^2");
            s = s.Replace(":", "/");

            return s;
        }

        private Expr ParseExpression()
        {
            var left = ParseTerm();
            while(_pos<_s.Length && (_s[_pos]=='+' || _s[_pos] == '-'))
            {
                char op = _s[_pos];
                _pos++;
                var right = ParseTerm();
                left=new BinOp(left, right,op);

            }
            return left;
        }

        private Expr ParseTerm()
        {
            var left=ParseFactor ();
            while (_pos < _s.Length && (_s[_pos] == '*' || _s[_pos] == '/'))
            {
                char op = _s[_pos];
                _pos++;
                var right = ParseFactor();
                left = new BinOp(left, right, op);

            }

            return left;

        }

        private Expr ParseFactor()
        {
            var left = ParsePrimary();

            if (_pos < _s.Length && _s[_pos] == '^')
            {
                _pos++;
                var right = ParseFactor();
                return new BinOp(left, right, '^');
            }

            return left;
        }

        private Expr ParsePrimary()
        {
            if (_pos >= _s.Length)
                throw new Exception("Неожиданный конец строки");
            char c = _s[_pos];

            if(char.IsDigit(c) || c == '.')
            {
                string num = "";
                while (_pos<_s.Length && (char.IsDigit(_s[_pos])|| _s[_pos] == '.'))
                {
                    num += _s[_pos];
                    _pos++;
                }
                double value =double.Parse(num, CultureInfo.InvariantCulture);
                return new Const(value);
            }
            if (c == 't')
            {
                _pos++;
                return new VarT();
            }
            if (c == '(')
            {
                _pos++;
                var inner = ParseExpression();
                if (_pos >= _s.Length || _s[_pos] != ')')
                    throw new Exception("Не закрыта скобка");
                _pos++;
                return inner;

            }
            if (c == '-')
            {
                _pos++;
                return new Negate(ParsePrimary());
            }
            if (c == '+')
            {
                _pos++;
                return ParsePrimary();
            }

            throw new Exception($"Недопустимый символ: {c}");

        }

    }
}
