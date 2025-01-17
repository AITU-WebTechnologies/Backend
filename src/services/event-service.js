const Event = require('../models/event-model');
const Organisation = require('../models/org-model');
const Checker = require('../models/checker-model');

class EventService {
    async createEvent(data) {
        const event = new Event(data);
        await event.save();
        return event;
    }

    async getAllEvents(organisationId) {
        const organisation = await Organisation.findOne({ organisationId });
        if (!organisation) {
            throw new Error("Организация не найдена.");
        }
        return await Event.find({ creatorEmail: organisation.email });
    }

    async getEventById(eventId) {
        return await Event.findOne({ eventId });
    }

    async deleteEvent(eventId) {
        return await Event.findOneAndDelete({ eventId });
    }

    async updateEvent(eventId, updatedData) {
        return await Event.findOneAndUpdate({ eventId }, updatedData, {
            new: true,
            runValidators: true,
        });
    }

    async getEventsForChecker(email) {
        return await Event.find({ emailFields: email });
    }

    async updateParticipantStatus(eventId, updatedParticipants) {
        const event = await Event.findOne({ eventId });
        if (!event) {
            throw new Error("Событие не найдено.");
        }

        event.participants = event.participants.map((participant) => {
            const updatedParticipant = updatedParticipants.find(
                (p) => p.iin === participant.iin
            );
            if (updatedParticipant) {
                return {
                    ...participant,
                    status: updatedParticipant.status,
                };
            }
            return participant;
        });

        await event.save();
        return event;
    }

    async validateOrganisationAccess(organisationId, event) {
        const organisation = await Organisation.findOne({ organisationId });
        if (!organisation || event.creatorEmail !== organisation.email) {
            throw new Error("Доступ запрещен.");
        }
    }

    async validateCheckerAccess(checkerId, event) {
        const checker = await Checker.findOne({ checkerId });
        if (!checker || !event.emailFields.includes(checker.email)) {
            throw new Error("Доступ запрещен.");
        }
    }
}

module.exports = new EventService();
