# Parser generator
This parser generator works on Operator-precedence grammar.

Example of input grammar:<br>E -> E+E | E*E | id

However, the grammar given below is not an operator grammar because two non-terminals are adjacent to each other:
<br>S -> SAS | a
<br>A -> bSb | b

We can convert it into an operator grammar, though:
<br>S -> SbSbS | SbS | a
<br>A -> bSb | b  

<h1>Defenitions format</h1>
Those grammar rules, such as tokens should be defined in json format. 

The example for grammar:
<br>E → E+T/T
<br>T → T*F/F
<br>F → id 
```javascript
{
  tokens: [
    {
      name: 'id',
      regex: /[a-zA-Z]+/
    },
    {
      name: 'PLUS',
      regex: /\+/
    },
    {
      name: 'MULT',
      regex: /\*/
    },
    {
      name: '_',
      regex: /\s+|\t+|\n+/,
      skip: true
    }
  ],
  rules: [
    {
      name : 'E',
      rules: ['E PLUS T', 'T']
    },
    {
      name: 'T',
      rules: ['T MULT F', 'F']
    },
    {
      name: 'F',
      rules: ['id']
    }
  ]
}
```
Token are defined in json with following properties:
<ul>
<li>name - Name for the token.</li>
<li>regex - Regular expression.</li>
<li>skip - Boolean, eather we add token to the token table or not.</li>
</ul>

Rules are defined in json with following properties:
<ul>
<li>name - Name for the rule.</li>
<li>rules - List of statements where rule can be defined.</li>
</ul>
