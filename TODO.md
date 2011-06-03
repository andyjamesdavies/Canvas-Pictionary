


Users
User
- states Ready, NotReady

Teams
Team
- has Users

Games
Game
- has Word, Teams, Users
- states Open, Locked

Words
Word

Chats
Chat
- has Users

Pages
Page

Application
- has Users, Teams, Games, Words, Chats

---

Browser

- add Users u to list of Teams t -> success, fail
    - server:  push list of teams to all browsers?
- get list of Teams
- add User u to Team t -> success, fail
- get list of Teams
- set User u to 'Ready'
- get list of Teams


Server
