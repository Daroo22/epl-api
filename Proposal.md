# my game proposal

For the first Project, I am building a connect four game. This game will potentially allow users to either enjoy it with friends or play against AI. This game will have a board of 6 by 7, giving the players enough space to plan strategic moves. At the end of this project, the playes will be able to clearly see the highlight of yhe winning match, hear sounds when they win, and track how many wins they have.

 ![connect4Board](./Assets/Digital%20Connect%204%20for%20Projector.jpg)  ![connect4Win](./Assets/Traditional-Connect-Four-Here-Red-wins-with-four-coins-aligned-diagonally.png.jpeg)  ![connect4Tie](./Assets/main-qimg-dfa731632130a8e12f78dca5f846828a.webp)

## User Stories

 - *As a player i want to be able to play connect four and have fun with my friends*
- *As a player, i want to see the game board clearly displayed*
- *As a player, i want to be able to choose my color (yellow or red) at the start of the game* 
- *As a player, i want to be able to drop disc into one of the columns*
- *As a player, i want to be able to see the disc occupy the lowest space within the column*
- *The game should randomly select which player gets the first turn*
- *As a player, i want to be able to switch turns between players*
- *As a player, i want to be able to tell who's turn it is*
- *The player should be able to clearly see who wins the round*
- *As a player, i want to be able to restart the game when a round is won*
- *If the grid is completely filled and no player has connected four discs, the game should declare a draw.* 
- *As a player I want to be able to win diagonally, hortizontally and vertically*



### Stretch Goals
- [] As a player, i want to be able to play against CP
- [] As a player, i want to hear sound effect for dropping disc and winning moves
- [] As a player, i want to see how many wins each player has
- [] As a player i want to see the winning lines Highlighed







## pseudocode 

// Set up html

// command !

// link JS and CSS

// Add the title 'Connect 4'

//Add a h1 tag on the body called 'connect 4'

// Add an Id that will track the winner

// Add another Id for the board

### Set up CSS
// Add body fonts family

// Add height and width size for the board (6 by 7 board)

// Add borders


### Set up JS

// set consts

// set variables

// Display empty board

// set current player to 'Red'

// set function to handle column (if column is not full, drop the disk in the lowest part of the column)

// After that, check for wins (for )

// If Yes, end game and display ("red wins")

// if no wins, switch turn

// Else (which means column is full) display 'its a draw'

// Set function to checkWin (for each row, column in board)

// IF currentPlayer has 4 consecutive discs in any direction (horizontal, vertical, diagonal) RETURN true

// If not, swith player (or its a draw)

// set function to check if Board is full for each column in the top row of the board

// IF column is empty then return false else return true

// set function to switch Player if currentPlayer is 'Red' then set current Player to 'Yellow' else set current Player to 'Red'

// Game Loop; while game is not over display 'currentPlayer's turn'

// Wait for player to select a column then switch player turn

// set function for reset Game; reset the board to empty values, SET currentPlayer to 'Red' then restart the game loop.
