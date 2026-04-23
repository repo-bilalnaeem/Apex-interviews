Project Name: APEX Interveiws
Problem: it is for users to practice how to give interviews for various job roles/positions by leveraging video calls with an AI agent.

What have i used for video-call? I have used an API from a service called stream.io (https://getstream.io/). which manages the API calling part. I have used the open-ai secret key to connect the Calling agent into stream. The service OpenAI calls it as Realtime Agents SDK. You can refer to how the integration can be done by the link i used: https://getstream.io/video/docs/react/ai-integration/openai-realtime/

Steps: 
1) user registers an account. 
2) User then login's.
3) the Logged in user goes to the agents tab in the sidebar. Create an agent by basically telling a job role they want to be interviewed for. example:
     
     Agent Name: Software Enineer Role - Noon Job Positing
     Description: (You copy any job description you find from linkedin related to the role) example: 
     - You will develop high-quality, responsive web applications using TypeScript, Javascript, React, Express. Experience with NestJS, Vite, and Next.js is a plus.
     - You will design and implement server-side APIs, data models, and business logic using mainly Express framework
     - You will create client-side function-based React components, hooks, stories, and tests to interact with your server-side work
    
4) I have a guardrail setup which uses openai to validate the sentiments of the job role, any override commands, looks for explicit injection patterns. If anyone tries to create an agent that is not related to CV/Job assocaited stuff. An agent will not be created and an error will be displayed in the UI. (First GuardRail)

5) Once the agent is created, the user can use this agent on the meetings tab available in the sidebar. The user can create a meeting. With their micropohone and webcam both open. The user can converse in multiple languages. Also during call the AI agent will only repspond to questions related to the Descrptions it was provided and will not go off topic. If user ask off-topic questions The AI agent will refuse to answer. (SecondGurad Rail)

6) Once the meeting is concluded, The meeeting gets Processed. Using an embedding model, a transcription is created and is vectorized. This transcription is forwarded to an AI text chatbot. When user asks a question, it is converted to vecotr and compared with the cosine similarity search and provides the chatbot with the most similar words. The text chatbot has the context available from your interview and the user can ask this chatbot questions on how to improve. anything off-topic asked and the chatbot refuses to reply. The chatbot is a multi agent chatbot, becuase based on the type of question either the ResumeAdvisor Agent, InterviewCoach Agent or TranscriptAnalysis Agent - will cater to the question asked.

7) Innegest is used for the background job, this is what is used to fetch the transcript from Stream.io, it uses OpenAI whisper model for speech analysis. It not only creates a transipt but also measures speaking pace and removes filler words exmaple 'like'. You can also watch the recording of your interview in the recording tab, while being in the same application.

8) The chabot also uses langchain by creating a chain of full chat history. I used the library @langchain/openai and @langchain/core. All the memory of the chat remains untill the session, restart the sever and the chathistory is deleted as it stays in localhost. (storing chat history in database does not make sense).

9) The application has in the sidebar two options to tailor your cv, and create a Cover Letter. You can upload your current CV/Resume, and have it analyzed in  ATS scoring manner, by giving a job description you can have it modified, and can also download it as a PDF or Word document. Similar is the proccess for Coverletter as well. If the document is as an image, the GPT-4o model scans the docuemnts to create Cover Letter/CV.

10) Deployment has been made on Vercel. Something imortant to Note: Since in UAE, video calling isnt allowed so the hosted app may or may not work as intended. A work around that i used was, i used Ngrok to do port forwading from my localhost to an EU region, running my AI Agent with the calling webhook in EU. Incase you are unable to converse with the AI agent - i made a short demo video and uploaded on YouTube for you to see: https://www.youtube.com/watch?v=J6xnt58yUmM&feature=youtu.be



YOUTUBE DEMO PROJECT DEMO: https://www.youtube.com/watch?v=J6xnt58yUmM