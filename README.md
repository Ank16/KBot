# KBot
### A self hostable Discord bot to play music in server voice channels.

**Guide:**
1. Clone the repo with ```git clone https://github.com/Ank16/KBot.git```
1. Go to https://discord.com/developers/applications and make a new application
    1. Go to the Bot tab and enable **MESSAGE CONTENT INTENT**
    1. Click **Reset Token** on the Bot tab and paste the token into the Dockerfile
    1. Go to the OAuth tab and paste the Client Id into the Dockerfile
1. Navigate to the directory of the cloned repo in a terminal or command line
1. Build the docker container with the command ```docker build -t kbot:latest .```
1. Run the container with the command ```docker run kbot:latest```
1. You have now successfully hosted the bot!
    1. If you shut down your computer or turn off the bot, start it again with ```docker run kbot:latest```

**To add the bot to servers:**
1. Go back to https://discord.com/developers/applications and go to the **OAuth2** tab of the application
    1. For bot permissions select *Send Messages* under **Text Permissions** as well as *Connect* and *Speak* under **Voice Permissions**
    1. Use the generated URL to add the bot to any servers you want (the bot can run on multiple servers concurrently)
