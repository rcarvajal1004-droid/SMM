const orders = [
  { id: 101, serviceId: 1, serviceName: 'Instagram Followers', link: 'https://instagram.com/user1', quantity: 500, charge: 6.25, status: 'Completed', createdAt: '2024-01-15' },
  { id: 102, serviceId: 4, serviceName: 'TikTok Likes', link: 'https://tiktok.com/@user2/video/123', quantity: 1000, charge: 6.50, status: 'In progress', createdAt: '2024-01-16' },
  { id: 103, serviceId: 6, serviceName: 'YouTube Views', link: 'https://youtube.com/watch?v=abc123', quantity: 5000, charge: 17.50, status: 'Pending', createdAt: '2024-01-17' }
];

export const ordersRepository = {
  findAll() { return [...orders]; },
  create(order) {
    const created = { id: Date.now(), ...order, status: 'Pending', createdAt: new Date().toISOString().split('T')[0] };
    orders.unshift(created);
    return created;
  }
};