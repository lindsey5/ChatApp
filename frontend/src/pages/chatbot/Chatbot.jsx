
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, TextField, Avatar } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import MicIcon from '@mui/icons-material/Mic';
import { fetchData, postData } from '../../services/api';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isAudioSending, setIsAudioSending] = useState(false);
    const bottomRef = useRef(null);

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY}); 

    const saveMessage = async (newMessage) => {
        await postData('/api/chatbot_message', newMessage);
    }

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetchData('/api/chatbot_message');
            console.log(response.messages.map(m => typeof m.message))
            setChats(response.messages)
        } 

        fetchMessages();
    }, [])

    useEffect(() => {
        if (bottomRef.current && chats.length > 0) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats]);

    const handleSubmit = async () => {
        if (!message.trim()) return;
        const newMessage = { sender: 'user', message, type: 'message' }
        setChats(prev => [...prev, newMessage]);
        await saveMessage(newMessage);
        setMessage('');
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: message,
            });
            const text = response.text; 
            if (text) {
                const botMessage = { sender: 'bot', message: text, type: 'message' };
                setChats(prev => [...prev, botMessage]);
                await saveMessage(botMessage);
            } else {
                const botMessage = { sender: 'bot', message: 'Sorry, I didn\'t get a text response.', type: 'message'};
                setChats(prev => [...prev, botMessage]);
                await saveMessage(botMessage);
            }
        } catch (error) {
            const botMessage = { sender: 'bot', message: 'Sorry, there was an error communicating with the AI.', type: 'message'};
            setChats(prev => [...prev, botMessage]);
            await saveMessage(botMessage);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                speechSynthesis.cancel();
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' }); 
                const audioUrl = URL.createObjectURL(audioBlob);
                const message = { sender: 'user', type: "audio", message: audioUrl }
                setChats(prev => [...prev, message]);
                await saveMessage(message)
                audioChunksRef.current = [];
                setIsAudioSending(true);
                try {
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    const base64Audio = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

                    const response = await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: [{
                            parts: [{
                                inlineData: {
                                    data: base64Audio,
                                    mimeType: 'audio/webm',
                                },
                            }],
                        }],
                    });
                    const text = response.text;
                    if (text) {
                        const botMessage = { sender: 'bot', message: text, type: 'message' }
                        setChats(prev => [...prev, botMessage]);
                         await saveMessage(botMessage);
                    } else {
                         const botMessage = { sender: 'bot', message: 'Sorry, I didn\'t understand the audio.', type: 'message' }
                        console.error('AI Audio Response Error: No text in response');
                        setChats(prev => [...prev, botMessage]);
                         await saveMessage(botMessage);
                    }
                } catch (error) {
                    const botMessage = { sender: 'bot', message: 'Sorry, I couldn\'t process the audio.', type: 'message' }
                    console.error('AI Audio Error:', error);
                    setChats(prev => [...prev, botMessage]);
                     await saveMessage(botMessage);
                } finally {
                    setIsRecording(false);
                    setIsAudioSending(false);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
            setChats(prev => [...prev, { sender: 'bot', message: 'Failed to access your microphone.', type: 'message' }]);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    return (
        <main className="h-[87%] flex flex-col">
            <div className='flex flex-col flex-grow p-10 min-h-0 overflow-y-auto'>
                <div className="w-full flex flex-col justify-center items-center gap-5 mt-10">
                    <div className='p-2 rounded-full shadow-lg shadow-[#1c18fa]'>
                        <Avatar src='robot.png' sx={{ width: 80, height: 80}}/>
                    </div>
                 </div>
                {chats.map((chat, index) => (
                    <div key={index} ref={index === chats.length - 1 ? bottomRef : undefined} className={`flex w-full mt-10 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className='max-w-1/2'>
                            <div className={`break-words rounded-lg ${chat.sender === 'user' ? 'bg-[#1c18fa] text-white' : 'bg-gray-300'} p-5`}>
                                {chat.type === 'audio' ? <audio controls src={chat.message} className="mt-4"></audio> : chat.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex w-full border-t-1 border-gray-300 p-5'>
                {!isAudioSending && !isRecording && <TextField
                   placeholder="Send a message" 
                    sx={{ flexGrow: 1}} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />} 
                {!isAudioSending && isRecording && <div className='flex-1'>Recording audio...</div>}
                {isAudioSending && <div className='flex-1'>Bot is thinking...</div>}
                
                <div>
                    {!isRecording && <IconButton 
                        onClick={handleSubmit} 
                        disabled={isAudioSending} 
                        size='large'
                    >
                        <SendIcon fontSize="inherit" sx={{ color: '#1c18fa'}} />
                    </IconButton>}
                    <IconButton
                        onClick={!isRecording ? startRecording : stopRecording} 
                        disabled={isAudioSending}
                        size='large'
                    >
                        {!isRecording ? <MicIcon fontSize="inherit" sx={{ color: '#1c18fa'}} /> : 
                        <CheckIcon fontSize="inherit" sx={{ color: '#1c18fa'}} />}
                    </IconButton>
                </div>
            </div>
        </main>
    );
};

export default Chatbot