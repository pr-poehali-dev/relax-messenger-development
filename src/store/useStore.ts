import { useState, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  bio?: string;
  phone?: string;
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
  type: 'private' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online?: boolean;
  pinned?: boolean;
  muted?: boolean;
  members?: string[];
}

export const MOCK_USERS: User[] = [
  { id: 'me', name: 'Алексей Смирнов', username: 'alexsmirn', avatar: 'АС', status: 'online', bio: 'Живу, люблю, работаю 🚀', phone: '+7 999 123-45-67' },
  { id: 'u1', name: 'Виктория Романова', username: 'vika_r', avatar: 'ВР', status: 'online' },
  { id: 'u2', name: 'Дмитрий Козлов', username: 'dima_k', avatar: 'ДК', status: 'away' },
  { id: 'u3', name: 'Анастасия Новик', username: 'nastya_n', avatar: 'АН', status: 'offline' },
  { id: 'u4', name: 'Максим Петров', username: 'max_p', avatar: 'МП', status: 'online' },
  { id: 'u5', name: 'Ольга Белова', username: 'olga_b', avatar: 'ОБ', status: 'offline' },
  { id: 'u6', name: 'Артём Фёдоров', username: 'artem_f', avatar: 'АФ', status: 'online' },
];

export const MOCK_CHATS: Chat[] = [
  { id: 'c1', type: 'private', name: 'Виктория Романова', avatar: 'ВР', lastMessage: 'Окей, увидимся в 7! 🎉', lastTime: '14:32', unread: 3, online: true, pinned: true },
  { id: 'c2', type: 'group', name: 'Команда Relax', avatar: '🚀', lastMessage: 'Дмитрий: Дизайн готов!', lastTime: '14:15', unread: 12 },
  { id: 'c3', type: 'private', name: 'Дмитрий Козлов', avatar: 'ДК', lastMessage: 'Посмотри мой pull request', lastTime: '13:44', unread: 0 },
  { id: 'c4', type: 'private', name: 'Анастасия Новик', avatar: 'АН', lastMessage: 'Спасибо за помощь!', lastTime: 'вчера', unread: 0 },
  { id: 'c5', type: 'group', name: 'Друзья 🎮', avatar: '🎮', lastMessage: 'Максим: Играем сегодня?', lastTime: 'вчера', unread: 5 },
  { id: 'c6', type: 'private', name: 'Максим Петров', avatar: 'МП', lastMessage: 'Договорились!', lastTime: 'пн', unread: 0, muted: true },
  { id: 'c7', type: 'private', name: 'Ольга Белова', avatar: 'ОБ', lastMessage: 'Хорошо, напишу потом', lastTime: 'вс', unread: 0 },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', chatId: 'c1', senderId: 'u1', text: 'Привет! Ты уже думал о планах на вечер?', time: '14:10', read: true },
    { id: 'm2', chatId: 'c1', senderId: 'me', text: 'Да, хотел предложить сходить в кино или кафе что нибудь', time: '14:18', read: true },
    { id: 'm3', chatId: 'c1', senderId: 'u1', text: 'О, кафе звучит отлично! Знаешь новое место на Арбате?', time: '14:25', read: true },
    { id: 'm4', chatId: 'c1', senderId: 'me', text: 'Нет, расскажи! Говорят там крутая атмосфера и инстаграмный интерьер 📸', time: '14:28', read: true },
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
};
