export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  bio?: string;
  phone?: string;
  isContact?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel';
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online?: boolean;
  pinned?: boolean;
  muted?: boolean;
  members?: string[];
  description?: string;
  subscribersCount?: number;
  isChannel?: boolean;
}

// Глобальная база "реальных" пользователей платформы — по ним ищем
export const PLATFORM_USERS: User[] = [
  { id: 'u1', name: 'Виктория Романова', username: 'vika_r', avatar: 'ВР', status: 'online', bio: 'Дизайнер интерфейсов ✨', phone: '+7 916 234-56-78' },
  { id: 'u2', name: 'Дмитрий Козлов', username: 'dima_k', avatar: 'ДК', status: 'away', bio: 'Frontend разработчик 💻', phone: '+7 926 345-67-89' },
  { id: 'u3', name: 'Анастасия Новик', username: 'nastya_n', avatar: 'АН', status: 'offline', bio: 'Маркетолог | Блогер 📸', phone: '+7 903 456-78-90' },
  { id: 'u4', name: 'Максим Петров', username: 'max_p', avatar: 'МП', status: 'online', bio: 'iOS разработчик 🍏', phone: '+7 909 567-89-01' },
  { id: 'u5', name: 'Ольга Белова', username: 'olga_b', avatar: 'ОБ', status: 'offline', bio: 'Путешественница ✈️', phone: '+7 911 678-90-12' },
  { id: 'u6', name: 'Артём Фёдоров', username: 'artem_f', avatar: 'АФ', status: 'online', bio: 'Бэкенд разработчик ⚙️', phone: '+7 925 789-01-23' },
  { id: 'u7', name: 'Ирина Соколова', username: 'irina_s', avatar: 'ИС', status: 'online', bio: 'Продуктовый менеджер 🚀' },
  { id: 'u8', name: 'Павел Лебедев', username: 'pavel_l', avatar: 'ПЛ', status: 'away', bio: 'Инди-разработчик 🛠' },
  { id: 'u9', name: 'Екатерина Смирнова', username: 'katya_sm', avatar: 'ЕС', status: 'online', bio: 'QA инженер 🔍' },
  { id: 'u10', name: 'Никита Волков', username: 'nikita_v', avatar: 'НВ', status: 'offline', bio: 'DevOps 🖥' },
  { id: 'u11', name: 'Мария Кузнецова', username: 'masha_k', avatar: 'МК', status: 'online', bio: 'UX исследователь 💡' },
  { id: 'u12', name: 'Сергей Попов', username: 'sergey_p', avatar: 'СП', status: 'away', bio: 'Data Scientist 📊' },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

const DEFAULT_ME: User = {
  id: 'me',
  name: 'Алексей Смирнов',
  username: 'alexsmirn',
  avatar: 'АС',
  status: 'online',
  bio: 'Живу, люблю, работаю 🚀',
  phone: '+7 999 123-45-67',
};

const DEFAULT_CONTACTS: string[] = ['u1', 'u2', 'u3', 'u4'];

const DEFAULT_CHATS: Chat[] = [
  { id: 'c1', type: 'private', name: 'Виктория Романова', avatar: 'ВР', lastMessage: 'Окей, увидимся в 7! 🎉', lastTime: '14:32', unread: 3, online: true, pinned: true },
  { id: 'c2', type: 'group', name: 'Команда Relax 🚀', avatar: '🚀', lastMessage: 'Дмитрий: Дизайн готов!', lastTime: '14:15', unread: 12, members: ['me', 'u1', 'u2', 'u4'], description: 'Рабочий чат команды' },
  { id: 'c3', type: 'private', name: 'Дмитрий Козлов', avatar: 'ДК', lastMessage: 'Посмотри мой pull request', lastTime: '13:44', unread: 0 },
  { id: 'c4', type: 'private', name: 'Анастасия Новик', avatar: 'АН', lastMessage: 'Спасибо за помощь!', lastTime: 'вчера', unread: 0 },
  { id: 'c5', type: 'channel', name: 'Tech Новости', avatar: '📡', lastMessage: 'Apple представила новый чип M4 Pro', lastTime: 'вчера', unread: 5, isChannel: true, subscribersCount: 12400, description: 'Последние новости из мира технологий' },
  { id: 'c6', type: 'group', name: 'Друзья 🎮', avatar: '🎮', lastMessage: 'Максим: Играем сегодня?', lastTime: 'пн', unread: 2, members: ['me', 'u2', 'u4', 'u6'], description: 'Игровой клуб' },
  { id: 'c7', type: 'private', name: 'Максим Петров', avatar: 'МП', lastMessage: 'Договорились!', lastTime: 'пн', unread: 0, muted: true },
];

const DEFAULT_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', chatId: 'c1', senderId: 'u1', text: 'Привет! Ты уже думал о планах на вечер?', time: '14:10', read: true },
    { id: 'm2', chatId: 'c1', senderId: 'me', text: 'Да, хотел предложить сходить в кино или кафе', time: '14:18', read: true },
    { id: 'm3', chatId: 'c1', senderId: 'u1', text: 'О, кафе звучит отлично! Знаешь новое место на Арбате?', time: '14:25', read: true },
    { id: 'm4', chatId: 'c1', senderId: 'me', text: 'Нет, расскажи! Говорят там крутая атмосфера 📸', time: '14:28', read: true },
    { id: 'm5', chatId: 'c1', senderId: 'u1', text: 'Да, там очень уютно! Встречаемся в 7 вечера?', time: '14:30', read: true },
    { id: 'm6', chatId: 'c1', senderId: 'u1', text: 'Окей, увидимся в 7! 🎉', time: '14:32', read: false },
  ],
  c2: [
    { id: 'm1', chatId: 'c2', senderId: 'u1', text: 'Всем привет! Новая версия почти готова', time: '13:00', read: true },
    { id: 'm2', chatId: 'c2', senderId: 'u2', text: 'Отлично! Дизайн готов! Скидываю макеты', time: '14:15', read: false },
    { id: 'm3', chatId: 'c2', senderId: 'u4', text: 'Жду не дождусь посмотреть 👀', time: '14:16', read: false },
  ],
  c3: [
    { id: 'm1', chatId: 'c3', senderId: 'u2', text: 'Привет! Можешь глянуть мой pull request?', time: '13:40', read: true },
    { id: 'm2', chatId: 'c3', senderId: 'me', text: 'Конечно, сейчас посмотрю', time: '13:42', read: true },
    { id: 'm3', chatId: 'c3', senderId: 'u2', text: 'Посмотри мой pull request', time: '13:44', read: true },
  ],
  c5: [
    { id: 'm1', chatId: 'c5', senderId: 'channel', text: '🍏 Apple представила новый чип M4 Pro с невероятной производительностью', time: 'вчера', read: false },
    { id: 'm2', chatId: 'c5', senderId: 'channel', text: '🤖 OpenAI выпустила новую модель GPT-5 с поддержкой видео', time: '10:00', read: false },
  ],
};

// Реактивное хранилище через класс + события
class AppStore {
  me: User;
  contacts: string[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.me = loadFromStorage('relax_me', DEFAULT_ME);
    this.contacts = loadFromStorage('relax_contacts', DEFAULT_CONTACTS);
    this.chats = loadFromStorage('relax_chats', DEFAULT_CHATS);
    this.messages = loadFromStorage('relax_messages', DEFAULT_MESSAGES);
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  save() {
    saveToStorage('relax_me', this.me);
    saveToStorage('relax_contacts', this.contacts);
    saveToStorage('relax_chats', this.chats);
    saveToStorage('relax_messages', this.messages);
    this.notify();
  }

  updateMe(data: Partial<User>) {
    this.me = { ...this.me, ...data };
    this.save();
  }

  addContact(userId: string) {
    if (!this.contacts.includes(userId)) {
      this.contacts = [...this.contacts, userId];
      this.save();
    }
  }

  removeContact(userId: string) {
    this.contacts = this.contacts.filter(id => id !== userId);
    this.save();
  }

  getContacts(): User[] {
    return this.contacts.map(id => PLATFORM_USERS.find(u => u.id === id)).filter(Boolean) as User[];
  }

  sendMessage(chatId: string, text: string): Message {
    const msg: Message = {
      id: `m${Date.now()}`,
      chatId,
      senderId: 'me',
      text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.messages = {
      ...this.messages,
      [chatId]: [...(this.messages[chatId] || []), msg],
    };
    this.chats = this.chats.map(c =>
      c.id === chatId ? { ...c, lastMessage: text, lastTime: msg.time, unread: 0 } : c
    );
    this.save();
    return msg;
  }

  receiveMessage(chatId: string, senderId: string, text: string) {
    const msg: Message = {
      id: `m${Date.now()}`,
      chatId,
      senderId,
      text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.messages = {
      ...this.messages,
      [chatId]: [...(this.messages[chatId] || []), msg],
    };
    this.chats = this.chats.map(c =>
      c.id === chatId ? { ...c, lastMessage: text, lastTime: msg.time, unread: (c.unread || 0) + 1 } : c
    );
    this.save();
  }

  createChat(type: 'private' | 'group' | 'channel', data: {
    name: string;
    avatar: string;
    members?: string[];
    description?: string;
    userId?: string;
  }): Chat {
    const id = `c${Date.now()}`;
    const chat: Chat = {
      id,
      type,
      name: data.name,
      avatar: data.avatar,
      lastMessage: type === 'channel' ? 'Канал создан' : 'Чат создан',
      lastTime: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      members: data.members || ['me'],
      description: data.description,
      isChannel: type === 'channel',
      subscribersCount: type === 'channel' ? 1 : undefined,
      online: type === 'private' ? true : undefined,
    };
    this.chats = [chat, ...this.chats];
    this.messages = { ...this.messages, [id]: [] };
    this.save();
    return chat;
  }

  markRead(chatId: string) {
    this.chats = this.chats.map(c => c.id === chatId ? { ...c, unread: 0 } : c);
    this.messages = {
      ...this.messages,
      [chatId]: (this.messages[chatId] || []).map(m => ({ ...m, read: true })),
    };
    this.save();
  }

  deleteChat(chatId: string) {
    this.chats = this.chats.filter(c => c.id !== chatId);
    const { [chatId]: _, ...rest } = this.messages;
    this.messages = rest;
    this.save();
  }

  togglePin(chatId: string) {
    this.chats = this.chats.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c);
    this.save();
  }

  toggleMute(chatId: string) {
    this.chats = this.chats.map(c => c.id === chatId ? { ...c, muted: !c.muted } : c);
    this.save();
  }
}

export const store = new AppStore();

// React hook
import { useState, useEffect } from 'react';

export function useStore() {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    return store.subscribe(() => forceUpdate(n => n + 1));
  }, []);
  return store;
}
