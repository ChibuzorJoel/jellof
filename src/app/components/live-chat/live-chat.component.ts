import { Component, OnInit } from '@angular/core';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit {
  isOpen = false;
  isMinimized = false;
  messageText = '';
  messages: Message[] = [];
  isAgentTyping = false;
  agentName = 'JELLOF Support';
  agentStatus = 'online'; // online, offline, away
  unreadCount = 0;

  ngOnInit(): void {
    // Initial greeting message
    setTimeout(() => {
      this.addAgentMessage('Hello! 👋 Welcome to JELLOF. How can we help you today?');
    }, 2000);
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      this.isMinimized = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChat(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: this.messageText,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.messageText = '';
    this.scrollToBottom();

    // Simulate agent typing
    this.isAgentTyping = true;

    // Simulate agent response
    setTimeout(() => {
      this.isAgentTyping = false;
      this.handleUserMessage(userMessage.text);
    }, 1500);
  }

  handleUserMessage(messageText: string): void {
    const lowerText = messageText.toLowerCase();

    // Auto-responses based on keywords
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      this.addAgentMessage('Hello! How can I assist you today? 😊');
    } else if (lowerText.includes('price') || lowerText.includes('cost')) {
      this.addAgentMessage('You can view prices on our product pages. We also offer seasonal discounts! Would you like help finding something specific?');
    } else if (lowerText.includes('shipping') || lowerText.includes('delivery')) {
      this.addAgentMessage('We offer FREE standard shipping (5-7 days), Express shipping ($15, 2-3 days), and Overnight shipping ($30, 1 day). Where are you located?');
    } else if (lowerText.includes('return') || lowerText.includes('refund')) {
      this.addAgentMessage('We have a 30-day return policy for all items. Items must be unworn and in original condition. Would you like to start a return?');
    } else if (lowerText.includes('order') || lowerText.includes('track')) {
      this.addAgentMessage('You can track your order by logging into your account and visiting the Orders page. Do you need help with a specific order?');
    } else if (lowerText.includes('size') || lowerText.includes('sizing')) {
      this.addAgentMessage('You can find our size guide on each product page. Would you like help with sizing for a specific item?');
    } else if (lowerText.includes('thank')) {
      this.addAgentMessage('You\'re welcome! Is there anything else I can help you with? 😊');
    } else if (lowerText.includes('bye')) {
      this.addAgentMessage('Thank you for contacting JELLOF! Have a wonderful day! 👋');
    } else {
      // Default response
      this.addAgentMessage('Thank you for your message! A support agent will respond shortly. You can also email us at support@jellof.com or call +234 800 000 0000.');
    }
  }

  addAgentMessage(text: string): void {
    const message: Message = {
      id: Date.now(),
      text: text,
      sender: 'agent',
      timestamp: new Date()
    };

    this.messages.push(message);
    
    if (!this.isOpen) {
      this.unreadCount++;
    }

    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const messageContainer = document.querySelector('.chat-messages');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  startNewChat(): void {
    this.messages = [];
    this.addAgentMessage('Hello! 👋 Welcome to JELLOF. How can we help you today?');
  }

  getTimeString(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }
}