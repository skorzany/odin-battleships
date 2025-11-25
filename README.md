# odin-battleships

A classic Battleships game, made entirely in vanilla JavaScript as part of the Odin Project.<br/>
Offers two game modes: one player vs AI or hot-seat for two players.<br/>
Features a drag & drop functionality for ship placements.<br/>
The game is intended to be played on wide screen (preferably desktop).<br/>
You can try it out on [GitHub Pages](https://skorzany.github.io/odin-battleships/).<br/><br/>
This was the final project of the JavaScript course, and was a great opportunity to put<br/>
all my new knowledge into practice (as well as a good refresher on CSS grid).<br/>
The main focus here was test-driven-development: I had to familiarize myself with<br/>
a new <em>test-first</em> workflow and unit testing principles and learned using <em>jest</em>.<br/>
Although the unit tests are for the game model only (testing the DOM was not required here),<br/>
I did my best to test every game rule thoroughly, especially different ship placement scenarios,<br/>
so that every case is covered and the game plays according to the 1990 Milton Bradley rules.<br/>
I have also put an emphasis on memory management, and ensured that no elements<br/>
and their event listeners are left hanging around.<br/><br/>
The AI opponent makes random moves, although it keeps track of its previous shots,<br/>
so it won't attack the same cell twice.<br/>
I might add some code in the future, for making the AI opponent more competitive.<br/><br/>
I hope that you like it, have fun playing!
