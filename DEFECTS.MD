Known Defects:

1. tournamentid is saved when changing roles to client and when there are more than one server role. - Priority: medium
    - This issue could be fixed if we allow only one server to be present. However, for now, the issue is
    when there are more than one active server role, and a server changes its role to client, the tournamentid is still saved, causing the
    tournament error message to show everytime on refresh until another server refreshes.

2. Only one server is allowed at a time. - Priority: High
    - I began to write this with the intention of having only one 'server' at a time. As I realized, we actually want the capability to have more than 
    one server. This will be a feature added later on.

2. RoleModal.html does not show Material Design Checkbox. - Priority: low
    - This is a weird one, I literally copied and pasted the SettingsModal.ejs to the RoleModal.html and it does not show the material design
    checkbox. This isn't a big deal though.

3. No Support for IE9, mainly because of the CustomEvent class.

4. If a user is in the send a match modal, and a user new user connects or disconnects, the id of the match is not stored and thus, returns an error. A temporary way around this is to exit the modal and click the send match client again, but for the time being, a temporary fix was added.

5. Sometimes matches will not display on a server, not sure why. Solution is to refresh.

6. If matches were given to a client, and a server leaves/exists the browser session. The client will still display the last match they had.

7. Reopening matches in Challonge forces the user to run the "reset everyone" button to refresh the open matches. This can be annoying as then we have to setup all the servers and clients again. This is caused because we aren't always pinging challonge for open matches and as we retrieve open matches from in memory. We only ping again after we update a match. Perhaps we could could consider a "update open matches" button that will ping challonge and update the open matches. 