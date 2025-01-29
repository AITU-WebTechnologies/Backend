const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/index');
const organisationService = require('../src/services/org-service');
const Organisation = require('../src/models/org-model');
const eventService = require('../src/services/event-service');

const { expect } = chai;

const mockOrgId = 123; 
const mockToken = `Bearer ${jwt.sign({ id: mockOrgId }, process.env.secretKey, { expiresIn: '15m' })}`;


describe('OrganisationController Endpoints', () => {
  describe('POST /create-org', () => {
    it('should send a confirmation code to the email', async () => {
      const requestData = {
        title: 'Test Org',
        role: 'admin',
        email: 'test@example.com',
        password: 'password123',
      };

      sinon.stub(organisationService, 'createOrganisationTemp').resolves({
        message: 'Confirmation code sent to your email. Please verify your email.',
      });

      const res = await request(app).post('/api/organisation/create-org').send(requestData);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Confirmation code sent to your email. Please verify your email.');

      organisationService.createOrganisationTemp.restore();
    });
  });

  describe('POST /confirm-org', () => {
    it('should return access and refresh tokens on successful confirmation', async () => {
      const requestData = {
        email: 'test@example.com',
        code: '123456',
      };

      sinon.stub(organisationService, 'confirmOrganisationCode').callsFake(async (data) => {
        if (data.email === requestData.email && data.code === requestData.code) {
          return {
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
          };
        }
        throw new Error('Invalid confirmation code.');
      });

      const res = await request(app).post('/api/organisation/confirm-org').send(requestData);

      expect(res.status).to.equal(200);
      expect(res.body.accessToken).to.equal('mockAccessToken');
      expect(res.body).to.not.have.property('refreshToken');

      organisationService.confirmOrganisationCode.restore();
    });
  });

  describe('GET /profile', () => {
    it('should return the profile of the organisation', async () => {
      const mockProfile = { title: 'Test Org' };

      sinon.stub(organisationService, 'getProfile').resolves(mockProfile);

      const res = await request(app)
        .get('/api/organisation/profile')
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Test Org');

      organisationService.getProfile.restore();
    });
  });

  describe('PUT /update-profile', () => {
    it('should update the profile of the organisation', async () => {
      const requestData = { title: 'Updated Org' };

      sinon.stub(organisationService, 'updateProfile').resolves({ title: 'Updated Org' });

      const res = await request(app)
        .put('/api/organisation/update-profile')
        .set('Authorization', mockToken)
        .send(requestData);

      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Updated Org');

      organisationService.updateProfile.restore();
    });
  });


describe('EventController Endpoints', () => {
  let eventId;

  beforeEach(() => {
    sinon.stub(Organisation, 'findOne').resolves({
      organisationId: mockOrgId,
      email: 'test@example.com', 
    });
  });

  afterEach(() => {
    sinon.restore(); 
  });
  describe('POST /create-event', () => {
    it('should create a new event', async () => {
      const eventData = {
        name: 'Test Event',
        description: 'Event description',
        date: '2025-02-01',
        creatorEmail: 'test@example.com',
        participants: [
          { name: 'Participant 1', iin: '123456' },
          { name: 'Participant 2', iin: '654321' },
        ],
      };
  
      sinon.stub(eventService, 'createEvent').resolves({
        ...eventData,
        eventId: 'mockEventId',
      });
  
      const res = await request(app)
        .post('/api/event/create-event')
        .set('Authorization', mockToken)
        .send(eventData);
  
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('eventId'); 
  
      eventId = res.body.eventId || 'mockEventId';
  
      eventService.createEvent.restore();
    });
  });
  

  describe('GET /all-events', () => {
    it('should return all events for the organisation', async () => {
      const mockEvents = [
        { name: 'Event 1', creatorEmail: 'test@example.com' },
        { name: 'Event 2', creatorEmail: 'test@example.com' },
      ];

      sinon.stub(eventService, 'getAllEvents').resolves(mockEvents);

      const res = await request(app)
        .get('/api/event/all-events')
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0].name).to.equal('Event 1');

      eventService.getAllEvents.restore();
    });
  });

  describe('GET /:eventId', () => {
    it('should return event details by eventId', async () => {
      if (!eventId) {
        throw new Error('eventId is undefined! Check if /create-event test is working correctly.');
      }
  
      sinon.restore(); 
  
      const mockEvent = {
        eventId: eventId,
        name: 'Test Event',
        description: 'Event description',
        creatorEmail: 'test@example.com',
      };
  
      sinon.stub(eventService, 'getEventById').resolves(mockEvent);
      sinon.stub(organisationService, 'getProfile').resolves({
        organisationId: mockOrgId,
        email: 'test@example.com',
      });
  
      sinon.stub(Organisation, 'findOne').resolves({
        organisationId: mockOrgId,
        email: 'test@example.com',
      });

  
      const res = await request(app)
        .get(`/api/event/${eventId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: mockOrgId }, process.env.secretKey, { expiresIn: '15m' })}`);
  
  
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Test Event');
    });
  });
  
  

  describe('PUT /:eventId', () => {
    it('should update an event', async () => {
      if (!eventId) {
        throw new Error('eventId is undefined! Check if /create-event test is working correctly.');
      }

      const updatedData = { name: 'Updated Event' };

      const mockEvent = {
        eventId: eventId,
        name: 'Test Event',
        description: 'Event description',
        creatorEmail: 'test@example.com',
      };

      sinon.stub(eventService, 'getEventById').resolves(mockEvent);
      sinon.stub(eventService, 'updateEvent').resolves({
        eventId: eventId,
        name: 'Updated Event',
      });

      const res = await request(app)
        .put(`/api/event/${eventId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: mockOrgId }, process.env.secretKey, { expiresIn: '15m' })}`)
        .send(updatedData);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Updated Event');
    });
  });

  describe('DELETE /:eventId', () => {
    it('should delete an event by eventId', async () => {
      if (!eventId) {
        throw new Error('eventId is undefined! Check if /create-event test is working correctly.');
      }

      const mockEvent = {
        eventId: eventId,
        name: 'Test Event',
        description: 'Event description',
        creatorEmail: 'test@example.com',
      };

      sinon.stub(eventService, 'getEventById').resolves(mockEvent);
      sinon.stub(eventService, 'deleteEvent').resolves();

      const res = await request(app)
        .delete(`/api/event/${eventId}`)
        .set('Authorization', `Bearer ${jwt.sign({ id: mockOrgId }, process.env.secretKey, { expiresIn: '15m' })}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Событие успешно удалено.');
    });
  });

  describe('DELETE /delete-account', () => {
    it('should delete the organisation account', async () => {
      sinon.stub(organisationService, 'deleteProfile').resolves();

      const res = await request(app)
        .delete('/api/organisation/delete-account')
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Аккаунт успешно удалён.');

      organisationService.deleteProfile.restore();
    });
  });
});
});
