class MatchingQueue {
  constructor() {
    this.queue = [];
    this.activeChats = new Map();
  }

  addUser(userId, socketId, anonymousName, institution) {
    this.queue.push({
      userId,
      socketId,
      anonymousName,
      institution,
      addedAt: Date.now(),
    });
  }

  removeUser(userId) {
    this.queue = this.queue.filter((user) => user.userId !== userId);
  }

  findMatch() {
    if (this.queue.length < 2) return null;

    const user1 = this.queue.shift();
    const user2 = this.queue.shift();

    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.activeChats.set(chatId, {
      user1,
      user2,
      startedAt: Date.now(),
    });

    return {
      chatId,
      user1,
      user2,
    };
  }

  getQueueLength() {
    return this.queue.length;
  }

  endChat(chatId) {
    this.activeChats.delete(chatId);
  }

  getActiveChatsCount() {
    return this.activeChats.size;
  }

  getOnlineUsersCount() {
    return this.queue.length + this.activeChats.size * 2;
  }
}

export default new MatchingQueue();
