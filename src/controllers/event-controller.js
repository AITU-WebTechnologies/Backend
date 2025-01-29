const eventService = require("../services/event-service");
const Organisation = require('../models/org-model');
const Checker = require("../models/checker-model")

class EventController {
  async createEvent(req, res) {
    try {
      const eventData = req.body;
      const event = await eventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllEvents(req, res) {
    try {
      const organisationId = req.user.id; 
      const events = await eventService.getAllEvents(organisationId);
      res.status(200).json(events);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getEventById(req, res) {
    try {
      const { eventId } = req.params;
      console.log(eventId)
      const event = await eventService.getEventById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: "Событие не найдено." });
      }
  
      const organisationId = req.user.id;
      const organisation = await Organisation.findOne({ organisationId });
  
      if (!organisation || event.creatorEmail !== organisation.email) {
        return res.status(403).json({ message: "Доступ запрещен." });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  }
  

  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const event = await eventService.getEventById(eventId);

      if (!event) {
        return res.status(404).json({ message: "Событие не найдено." });
      }

      const organisationId = req.user.id;
      const organisation = await Organisation.findOne({ organisationId });

      if (!organisation || event.creatorEmail !== organisation.email) {
        return res.status(403).json({ message: "Доступ запрещен." });
      }

      await eventService.deleteEvent(eventId);
      res.status(200).json({ message: "Событие успешно удалено." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
        const { eventId } = req.params;
        const updatedData = req.body;

        const event = await eventService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Событие не найдено." });
        }

        const organisationId = req.user.id;
        const organisation = await Organisation.findOne({ organisationId });

        if (!organisation || event.creatorEmail !== organisation.email) {
            return res.status(403).json({ message: "Доступ запрещен." });
        }

        const updatedEvent = await eventService.updateEvent(eventId, updatedData);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    async getCheckerEvents(req, res) {
      try {
          const checkerId = req.user.id;

          const checker = await Checker.findOne({ checkerId });
  
          const events = await eventService.getEventsForChecker(checker.email);
          res.status(200).json(events);
      } catch (error) {
          res.status(404).json({ message: error.message });
      }
  }
  
  async viewEvent(req, res) {
    try {
        const { eventId } = req.params;
        const checkerId = req.user.id;
        const checker = await Checker.findOne({ checkerId });

        if (!checker) {
            return res.status(403).json({ message: "Доступ запрещен." });
        }

        const event = await eventService.getEventById(eventId);

        if (!event || !event.emailFields.includes(checker.email)) {
            return res.status(403).json({ message: "Доступ запрещен." });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  async updateParticipantStatus(req, res) {
    try {
      const { eventId } = req.params;
      const { participants } = req.body; 
  
      const event = await eventService.getEventById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: "Событие не найдено." });
      }
  
      const checkerId = req.user.id; 
      const checker = await Checker.findOne({ checkerId });
  
      if (!checker || !event.emailFields.includes(checker.email)) {
        return res.status(403).json({ message: "Доступ запрещен." });
      }
  
      const updatedEvent = await eventService.updateParticipantStatus(eventId, participants);
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
}

module.exports = new EventController();
