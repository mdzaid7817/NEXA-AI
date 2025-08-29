// static/script.js

document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("recordBtn");
    const statusDisplay = document.getElementById("statusDisplay");
    const chatLog = document.getElementById('chat-log');
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
    const saveKeysBtn = document.getElementById("saveKeysBtn");
    
    let isRecording = false;
    let ws = null;
    let audioContext;
    let mediaStream;
    let processor;
    let audioQueue = [];
    let isPlaying = false;
    let assistantMessageDiv = null;

    // Load saved API keys
    const loadSettings = () => {
        document.getElementById("murfApiKey").value = localStorage.getItem("murfApiKey") || "";
        document.getElementById("assemblyAiApiKey").value = localStorage.getItem("assemblyAiApiKey") || "";
        document.getElementById("geminiApiKey").value = localStorage.getItem("geminiApiKey") || "";
        document.getElementById("serpApiKey").value = localStorage.getItem("serpApiKey") || "";
    };

    loadSettings();

    settingsBtn.addEventListener("click", () => {
        settingsModal.show();
    });

    saveKeysBtn.addEventListener("click", () => {
        localStorage.setItem("murfApiKey", document.getElementById("murfApiKey").value);
        localStorage.setItem("assemblyAiApiKey", document.getElementById("assemblyAiApiKey").value);
        localStorage.setItem("geminiApiKey", document.getElementById("geminiApiKey").value);
        localStorage.setItem("serpApiKey", document.getElementById("serpApiKey").value);
        settingsModal.hide();
        
        // Show success notification using Bootstrap toast or alert
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        successAlert.style.top = '20px';
        successAlert.style.right = '20px';
        successAlert.style.zIndex = '9999';
        successAlert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>API keys saved successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(successAlert);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successAlert.parentNode) {
                successAlert.remove();
            }
        }, 3000);
    });

    // Handle opening settings from warning modal
    document.getElementById("openSettingsFromWarning").addEventListener("click", () => {
        // Hide the warning modal
        const apiKeysWarningModal = bootstrap.Modal.getInstance(document.getElementById('apiKeysWarningModal'));
        apiKeysWarningModal.hide();
        
        // Show the settings modal
        settingsModal.show();
    });

    const addOrUpdateMessage = (text, type) => {
        if (type === "assistant") {
            assistantMessageDiv = document.createElement('div');
            assistantMessageDiv.className = 'message assistant';
            assistantMessageDiv.textContent = text;
            chatLog.appendChild(assistantMessageDiv);
        } else {
            assistantMessageDiv = null;
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user';
            messageDiv.textContent = text;
            chatLog.appendChild(messageDiv);
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    const playNextInQueue = () => {
        if (audioQueue.length > 0) {
            isPlaying = true;
            const base64Audio = audioQueue.shift();
            const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
            
            audioContext.decodeAudioData(audioData).then(buffer => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.onended = playNextInQueue;
                source.start();
            }).catch(e => {
                console.error("Error decoding audio data:", e);
                playNextInQueue();
            });
        } else {
            isPlaying = false;
        }
    };

    const startRecording = async () => {
        const apiKeys = {
            murf: localStorage.getItem("murfApiKey"),
            assemblyai: localStorage.getItem("assemblyAiApiKey"),
            gemini: localStorage.getItem("geminiApiKey"),
            serpapi: localStorage.getItem("serpApiKey")
        };

        // Check if any API key is missing
        if (!apiKeys.murf || !apiKeys.assemblyai || !apiKeys.gemini || !apiKeys.serpapi) {
            // Show the warning modal instead of alert
            const apiKeysWarningModal = new bootstrap.Modal(document.getElementById('apiKeysWarningModal'));
            apiKeysWarningModal.show();
            return;
        }

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            const source = audioContext.createMediaStreamSource(mediaStream);
            processor = audioContext.createScriptProcessor(4096, 1, 1);
            
            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                }
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(pcmData.buffer);
                }
            };

            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            ws = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);

            ws.onopen = () => {
                ws.send(JSON.stringify({ type: "config", keys: apiKeys }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === "assistant") {
                    addOrUpdateMessage(msg.text, "assistant");
                } else if (msg.type === "final") {
                    addOrUpdateMessage(msg.text, "user");
                } else if (msg.type === "audio") {
                    audioQueue.push(msg.b64);
                    if (!isPlaying) {
                        playNextInQueue();
                    }
                }
            };

            isRecording = true;
            recordBtn.classList.add("recording");
            statusDisplay.textContent = "Listening...";

        } catch (error) {
            console.error("Could not start recording:", error);
            
            // Show error modal instead of alert
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
            errorAlert.style.top = '20px';
            errorAlert.style.right = '20px';
            errorAlert.style.zIndex = '9999';
            errorAlert.innerHTML = `
                <i class="fas fa-exclamation-circle me-2"></i>Microphone access is required to use the voice agent.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(errorAlert);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (errorAlert.parentNode) {
                    errorAlert.remove();
                }
            }, 5000);
        }
    };

    const stopRecording = () => {
        if (processor) processor.disconnect();
        if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        if (ws) ws.close();
        
        isRecording = false;
        recordBtn.classList.remove("recording");
        statusDisplay.textContent = "Ready to chat!";
    };

    recordBtn.addEventListener("click", () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });
});
