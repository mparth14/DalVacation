const { PubSub } = require('@google-cloud/pubsub');

// Initialize PubSub and AWS clients
const pubSubClient = new PubSub();


exports.publishMessage = async (req, res) => {
    const { bookingId, concern, userId, userEmail, userName } = req.body;

    const dataBuffer = Buffer.from(JSON.stringify({ booking_id: bookingId, concern: concern, user_id: userId, user_email: userEmail, user_name: userName  }));

    try {
        const messageId = await pubSubClient.topic('guest_interactions').publish(dataBuffer);
        res.status(200).send(`Message ${messageId} published.`);
    } catch (error) {
        console.error('Error publishing message:', error);
        res.status(500).send('Error publishing message');
    }
};
