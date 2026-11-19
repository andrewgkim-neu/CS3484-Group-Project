// The fake API. Everyone imports from here:
//
//   import { getAlumni, sendMessage } from '../api'
//
// Every function is async (returns a Promise) and throws an ApiError
// (with .message and .status) when something goes wrong, just like a real
// backend would. Returned objects are copies; mutating them does nothing.
// Passwords are never included in returned user objects.

export { ApiError, resetDb as resetMockData, subscribe } from './db'

export {
  getCurrentUser,
  login,
  logout,
  signup,
  isNortheasternEmail,
  sendVerificationCode,
  verifyEmail,
  completeOnboarding,
  devLoginAs,
} from './auth'

export {
  getUser,
  getAlumni,
  getStudents,
  searchAlumni,
  getSuggestedAlumni,
  updateUser,
} from './users'

export { getPosts, createPost, deletePost } from './posts'

export {
  getConversations,
  getConversation,
  getOrCreateConversation,
  sendMessage,
  sendReferralRequest,
  respondToReferral,
  getPendingReferralRequests,
} from './conversations'

export {
  getAvailability,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  getMeetings,
  createMeeting,
  cancelMeeting,
} from './meetings'
