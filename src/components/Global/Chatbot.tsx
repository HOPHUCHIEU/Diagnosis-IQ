import { useState, useRef, useEffect } from 'react'
 import { Bot, Send, X } from 'lucide-react'
 import { Button } from '../ui/button'
 import { Textarea } from '../ui/textarea'
 
 interface Message {
   role: 'user' | 'bot'
   content: string
   timestamp: Date
 }
 
 interface Props {
   onClose: () => void
 }
 
 export default function ChatbotDialog({ onClose }: Props) {
   const [messages, setMessages] = useState<Message[]>([
     {
       role: 'bot',
       content: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?',
       timestamp: new Date()
     }
   ])
   const [input, setInput] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const messagesEndRef = useRef<HTMLDivElement>(null)
 
   const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
   }
 
   useEffect(() => {
     scrollToBottom()
   }, [messages])
 
   const handleSend = async () => {
     if (!input.trim() || isLoading) return
 
     const userMessage: Message = {
       role: 'user',
       content: input.trim(),
       timestamp: new Date()
     }
 
     setMessages((prev) => [...prev, userMessage])
     setInput('')
     setIsLoading(true)
 
     try {
       // TODO: Implement API call to chatbot service
       // const response = await chatbotService.sendMessage(input);
 
       // Simulate bot response for now
       setTimeout(() => {
         const botMessage: Message = {
           role: 'bot',
           content: 'Xin lỗi, tôi đang được phát triển và chưa thể trả lời câu hỏi của bạn.',
           timestamp: new Date()
         }
         setMessages((prev) => [...prev, botMessage])
         setIsLoading(false)
       }, 1000)
     } catch (error) {
       console.error('Error sending message:', error)
       setIsLoading(false)
     }
   }
 
   const handleKeyPress = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault()
       handleSend()
     }
   }
 
   return (
     <div className='flex flex-col h-full'>
       {/* Header */}
       <div className='flex items-center justify-between pb-4 border-b'>
         <div className='flex items-center gap-2'>
           <Bot className='w-6 h-6 text-primary' />
           <h2 className='font-semibold'>Trợ lý ảo</h2>
         </div>
       </div>
 
       {/* Messages */}
       <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
         {messages.map((message, index) => (
           <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div
               className={`max-w-[80%] rounded-lg p-3 ${
                 message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'
               }`}
             >
               <p className='whitespace-pre-wrap'>{message.content}</p>
               <p className='text-[10px] mt-1 opacity-70'>{message.timestamp.toLocaleTimeString()}</p>
             </div>
           </div>
         ))}
         {isLoading && (
           <div className='flex justify-start'>
             <div className='p-3 bg-gray-100 rounded-lg'>
               <div className='flex gap-1'>
                 <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
                 <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]' />
                 <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]' />
               </div>
             </div>
           </div>
         )}
         <div ref={messagesEndRef} />
       </div>
 
       {/* Input */}
       <div className='p-4 border-t'>
         <div className='flex items-center gap-2'>
           <Textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyPress}
             placeholder='Nhập tin nhắn...'
             className='min-h-[45px] max-h-[120px]'
             disabled={isLoading}
           />
           <Button size='icon' onClick={handleSend} disabled={!input.trim() || isLoading}>
             <Send className='w-4 h-4' />
           </Button>
         </div>
       </div>
     </div>
   )
 }