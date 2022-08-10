import { Controller } from "@nestjs/common";

@Controller()
export class UserController {
  //     private async testPassword(stored: {password: string, salt: string},
  //         ri: PasswordRetryInfo,
  //         password: string): Promise<{update?: PasswordRetryInfo, error?: any, hashedPasswordReplacement?: HashedPassword}> {
  // if(ri.time) {
  // const cooldown = ri.time.getTime() + 60000;
  // if(Date.now() < cooldown) {
  // if (ri.count === 3) {
  // return {
  //  update: {time: ri.time, count: ri.count + 1},
  //  error: ErrorFactory.unauthorized(
  //      {
  //          details: [{
  //              context: {
  //                  cooldown: cooldown,
  //                  now: Date.now()
  //              }
  //          }],
  //          message: ErrorMessages.COOLDOWN_PERIOD_STARTED,
  //          path: Paths.PASSWORD
  //      }, {generalErrorMessage: ErrorMessages.COOLDOWN_PERIOD_STARTED})
  // }
  // }
  // // Can this ever happen?
  // if (ri.count > 3) {
  // return {
  //  error: ErrorFactory.unauthorized({
  //      details: [{
  //          context: {
  //              cooldown: cooldown,
  //              now: Date.now()
  //          }
  //      }],
  //      message: ErrorMessages.COOLDOWN_PERIOD_STILL,
  //      path: Paths.PASSWORD
  //  }, {
  //      generalErrorMessage: ErrorMessages.COOLDOWN_PERIOD_STILL
  //  })
  // };
  // }
  // }
  // }
  // const passwordCompareResult = await this.passwordHasher.comparePassword(stored, password, true);
  // if (passwordCompareResult.success) {
  // const update =  ri.count > 0 ?  {count: 0, time: null} : undefined;
  // return {update, hashedPasswordReplacement: passwordCompareResult.replacement}
  // } else {
  // const count = ri.count + 1;
  // const update = count >= 3 ? {count: 3, time: new Date()} : {count, time: ri.time};
  // return {update, error: ErrorFactory.unauthorized(
  // {message: ErrorMessages.AUTHORIZATION_FAILED, path: Paths.PASSWORD},
  // {generalErrorMessage: ErrorMessages.AUTHORIZATION_FAILED}
  // )};
  // }
  // }
  // async createDeviceIfNeeded(userId: string, deviceId: string, identityKey: string): Promise<boolean> {
  // const devices = await this.userRepo.getDeviceAttributesForUsers(userId);
  // if (devices.length > 0 && devices.find(x => x.id === deviceId)) {
  // // We found this device already exists
  // return false;
  // } else {
  // if (devices.length >= this.maxDevices) {
  // let usedDevice = devices[0];
  // await this.deleteOtherDevice(userId, usedDevice);
  // } else {
  // logger.warn(`No other device to delete for user id ${userId}`)
  // }
  // const created = await this.userRepo.createDeviceForUser(userId, deviceId, identityKey);
  // if (!created) {
  // throw ErrorFactory.unprocessedError({
  // message: ErrorMessages.DEVICE_ALREADY_USED,
  // path: Paths.PHONE
  // }, {
  // generalErrorMessage: ErrorMessages.DEVICE_ALREADY_USED
  // });
  // }
  // return created
  // }
  // }
  // private async deleteOtherDevice(userId: string, usedDevice: DeviceAtts): Promise<void> {
  // const deviceTokenToDelete = usedDevice.token;
  // if (deviceTokenToDelete) {
  // logger.info(`Invalidating token found on device for user ${userId}, |${deviceTokenToDelete}|`);
  // await this.sessionManager.deleteSession(deviceTokenToDelete);
  // } else {
  // logger.info(`Not invalidating other device token to delete for user ${userId}`)
  // }
  // await this.userRepo.invalidateDevice(usedDevice.id);
  // await this.prekeyNotifier.purgeForDeviceIds([usedDevice.id]);
  // }
  // private async sendVerifyEmail(user: {email: string, token: string, firstName: string, lastName: string}) : Promise<void> {
  // const senderEmailAddress = {
  // name: 'The YEO Messaging Team',
  // address: 'no-reply@yeomessaging.com'
  // };
  // const receiverEmailAddress =  user.email;
  // let token = '';
  // if (user && user.token) {
  // const [token1, token2] = user.token.split("Bearer ")
  // token = token2;
  // if (token1 !== '') {
  // token = token1;
  // }
  // }
  // const firstName = user.firstName;
  // const lastName = user.lastName;
  // const file = readTemplate('confirmation.ejs');
  // const rendered = ejs.render(file, {
  // username: firstName + ' ' + lastName,
  // baseUrl: this.serverConfig.baseUrl,
  // completeRegistrationLink: encodeURI(this.serverConfig.baseUrl + AUTHORIZATION.PROFILE_REGISTRATION_CONFIRMATION_URI + token)});
  // const transporter = await nodemailer.createTransport(this.mailerConfig.transporter);
  // const mailOptions = {
  // from: senderEmailAddress,
  // to: receiverEmailAddress,
  // subject: EmailStrings.YEO_CONFIRMATION_SUBJECT,
  // html: rendered
  // }
  // await transporter.sendMail(mailOptions);
  // }
  // public async register(body): Promise<TokenBody & { registeredMask: number, status: ContactStatus }>{
  // const validBody: RegisterBody = await UserValidator.register(body);
  // if (await this.userRepo.isPhoneNumberTaken(validBody.phoneNumber)) {
  // throw ErrorFactory.unprocessedError({
  // message: ErrorMessages.PHONE_TAKEN,
  // path: Paths.PHONE
  // }, {
  // generalErrorMessage: ErrorMessages.PHONE_TAKEN
  // });
  // }
  // const registeredUser: UserAtts = await this.userRepo.register(validBody);
  // const loggedInUser = makeSessionInfo(registeredUser.id, undefined, SessionState.Registration);
  // const sessionHandle = await this.sessionManager.createSession(loggedInUser);
  // const smsCode = await this.smsRepo.generateSmsCode(registeredUser.id, validBody.phoneNumber);
  // await this.smsSender.sendSms(validBody.phoneNumber, smsCode);
  // if(registeredUser.email) {
  // const token = sessionHandle.tokens.bearer;
  // await this.sendVerifyEmail({email: registeredUser.email, firstName: registeredUser.firstName, lastName: registeredUser.lastName, token});
  // }
  // return {
  // ...tokenBodyFromTokens(sessionHandle.tokens),
  // registeredMask: calcRegisteredMask(registeredUser),
  // status: ContactStatus.KNOWN_BY_EX_ID // Should be a new status
  // };
  // }
  // public async login(body: LoginRequest): Promise<DataAndCookies<any>> {
  // // Todo API key
  // const credentials = body.credentials;
  // const phoneNumber = credentials.identity.kind == 'phoneNumber' ? credentials.identity.phoneNumber : undefined;
  // let user = await this.findUserFromProvidedIdentity(credentials.identity);
  // await this.testPasswordWithRetries(user, credentials.password);
  // if(body.device) {
  // const device = body.device;
  // // TODO: Do identity key stuff in enlistEnvelopeIdentity
  // const deviceCreated = await this.createDeviceIfNeeded(user.id, device.deviceId, device.identityDetails?.identityKey);
  // if (deviceCreated) {
  // const phoneNumbers = phoneNumber ? [phoneNumber] : [];
  // await this.notifyDeviceCreation(user.id, phoneNumbers);
  // }
  // await this.enlistEnvelopeIdentity(device);
  // const sessionHandle = await this.sessionManager.createSession(makeSessionInfo(user.id, device.deviceId, SessionState.LoggedIn));
  // // TODO: remove when all tokens upgraded
  // await this.userRepo.setAuthTokenForDevice(device.deviceId, sessionHandle.tokens.bearer);
  // return {data: {
  // ...tokenBodyFromTokens(sessionHandle.tokens),
  // registeredMask: calcRegisteredMask(user),
  // id: user.id,
  // phoneNumber,
  // createdAt: timeNum(user.createdAt),
  // updatedAt: timeNum(user.updatedAt),
  // email: user.email,
  // firstName: user.firstName,
  // lastName: user.lastName,
  // phoneVerified: user.phoneVerified,
  // avatarId: user.avatarId,
  // avatarAesKey: user.avatarAesKey,
  // avatarHmacKey: user.avatarHmacKey,
  // trackerId: user.trackerId,
  // trackerAesKey: user.trackerAesKey,
  // trackerHmacKey: user.trackerHmacKey,
  // country: user.country,
  // language: user.language,
  // isHidden: user.isHidden
  // }
  // };
  // } else {
  // const sessionHandle = await this.sessionManager.createSession(makeSessionInfo(user.id, null, SessionState.LoggedIn));
  // if(body.cookies) {
  // const accessToken = sessionHandle.tokens.access
  // // TODO split token and signature cookies if client needs to access token content
  // return {
  // data: {},
  // cookies: [['yeo_access_token', accessToken,
  //  {
  //      httpOnly: true,
  //      sameSite: true
  //  }
  // ]]
  // };
  // }else {
  // return {data: tokenBodyFromTokens(sessionHandle.tokens)};
  // }
  // }
  // }
  // private async findUserFromProvidedIdentity(identity: Identity): Promise<UserAtts> {
  // if (identity.kind === 'userId') {
  // const user = await this.userRepo.getUserAttributes(identity.userId);
  // if (!user || !user.regComplete ) {
  // throw ErrorFactory.preconditionFailed({
  // message: ErrorMessages.AUTHORIZATION_FAILED,
  // path: Paths.ID_AS_USER_ID
  // }, {generalErrorMessage: ErrorMessages.AUTHORIZATION_FAILED});
  // } else {
  // return user
  // }
  // }else if (identity.kind === 'phoneNumber') {
  // return await this.findRegisteredUserByPhone(identity.phoneNumber);
  // } else {
  // throw ErrorFactory.preconditionFailed({
  // message: ErrorMessages.AUTHORIZATION_FAILED,
  // path: Paths.PHONE
  // }, {generalErrorMessage: ErrorMessages.AUTHORIZATION_FAILED});
  // }
  // }
  // private async enlistEnvelopeIdentity(device: LoginDeviceDetails) {
  // const {identityDetails, deviceId} = device;
  // if (identityDetails && identityDetails.oneTimeKeys && identityDetails.oneTimeKeys.length > 0) {
  // const creates = prekeyCreatesFromSingleFieldJsonObjects(identityDetails.oneTimeKeys, deviceId);
  // await this.prekeyNotifier.createPrekeys(creates);
  // }
  // }
  // private async notifyDeviceCreation(userId: UserId, phoneNumbers: string[]) {
  // const conversationUserIds = await this.conversationNotifier.findUserIdsInConversationWithUser(userId);
  // const relatedUserIds = await this.contactsNotifier.findContactsToNotify(userId, phoneNumbers);
  // await this.dispatcher.sendToUsers(uniq([...conversationUserIds, ...relatedUserIds]), SocketEventType.SYNC_ALL);
  // }
  // private async findRegisteredUserByPhone(phoneNumber: PhoneNumber): Promise<UserAtts> {
  // const findResult = await this.userRepo.findRegisteredUserByPhone(phoneNumber);
  // if (findResult.kind != FoundUserKind.Found) {
  // const message = findResult.kind == FoundUserKind.NoRegisteredUser ? ErrorMessages.REGISTRATION_FAILED : ErrorMessages.AUTHORIZATION_FAILED;
  // throw ErrorFactory.preconditionFailed({
  // message: message,
  // path: Paths.PHONE
  // }, {generalErrorMessage: message});
  // }
  // return findResult.user;
  // }
  // private async testPasswordWithRetries(user: UserAtts, password: string) {
  // const {update, error, hashedPasswordReplacement} = await this.testPassword({password: user.password, salt: user.salt}, await this.userRepo.getPasswordRetryInfo(user.id), password);
  // if (update) {
  // await this.userRepo.updatePasswordRetryInfo(user.id, update)
  // }
  // if (hashedPasswordReplacement){
  // await this.userRepo.updateUser(user.id, hashedPasswordReplacement)
  // }
  // if (error) {
  // throw error;
  // }
  // }
  // public async setPassword(userId: UserId, body) {
  // const validBody = await UserValidator.setPasswordRequest(body);
  // const hashedPassword = await this.passwordHasher.hashPassword(validBody.password);
  // await this.userRepo.updateUser(userId, hashedPassword);
  // }
  // public async logout(session: Session, token: BearerToken) {
  // console.assert(token);
  // const deleted = this.sessionManager.deleteSession(token);
  // if (!deleted) {
  // throw ErrorFactory.forbiddenError(ErrorMessages.INVALID_CREDENTIALS);
  // }
  // }
  // async deleteAccount(auth: AuthContext, userId: UserId) : Promise<void> {
  // await auth.allow(Type.User, Action.Delete, userId);
  // const devicesToDelete = await this.userRepo.getDeviceAttributesForUsers(userId);
  // const deviceIdsToDelete = devicesToDelete.map(d=>d.id)
  // if (deviceIdsToDelete.length !== 0) {
  // await this.conversationNotifier.removeMessagesSentByDevices(deviceIdsToDelete);
  // await this.prekeyNotifier.purgeForDeviceIds(deviceIdsToDelete);
  // }
  // await this.conversationNotifier.removeConversationsForUserId(userId);
  // const relatedUserIds = await this.contactsNotifier.removeContactsForUserId(userId);
  // const user = await this.userRepo.getUserAttributes(userId);
  // //TODO: Need to consume all of the messages and attachments
  // //      pending for these devices
  // if(user.avatarId != null) {
  // await this.attachmentPurger.purgeAttachment(user.avatarId);
  // }
  // if(user.trackerId != null) {
  // await this.attachmentPurger.purgeAttachment(user.trackerId);
  // }
  // await this.userRepo.deleteUser(userId);
  // await this.dispatcher.sendToUsers(relatedUserIds, SocketEventType.SYNC_ALL);
  // await Promise.all(devicesToDelete.map(d=>this.sessionManager.deleteSession(d.token)));
  // }
  // async editProfile(auth: AuthContext, userId: UserId, body: any) : Promise<void> {
  // await auth.allow(Type.User, Action.Update, userId);
  // const validBody = await UserValidator.editProfile(body);
  // await this.checkPasswords(await this.userRepo.getPasswordAttributes(userId), validBody);
  // const fixAttachmentFieldValue = (name:string, value: string| null | undefined) => {
  // if (value === undefined) {
  // return {}
  // }else if(value === "" || value === null) {
  // return {[name]: null}
  // }else{
  // return {[name]: value}
  // }
  // }
  // const fixedAttachmentFields = {
  // ...fixAttachmentFieldValue("avatarId", validBody.avatarId),
  // ...fixAttachmentFieldValue("avatarAesKey", validBody.avatarAesKey),
  // ...fixAttachmentFieldValue("avatarHmacKey", validBody.avatarHmacKey),
  // ...fixAttachmentFieldValue("trackerId", validBody.trackerId),
  // ...fixAttachmentFieldValue("trackerAesKey", validBody.trackerAesKey),
  // ...fixAttachmentFieldValue("trackerHmacKey", validBody.trackerHmacKey),
  // };
  // // TODO: when unlinking attachments from profile, purge the attachment or decrement its references
  // //
  // const processedPasswordFields: {} | HashedPassword = validBody.newPassword ? await this.passwordHasher.hashPassword(validBody.newPassword) : {};
  // const updateFields: UserUpdateProcessed =  {
  // ...validBody,
  // ...processedPasswordFields,
  // ...fixedAttachmentFields
  // } ;
  // await this.userRepo.updateUser(userId, updateFields);
  // const phoneNumbers = await this.userRepo.getPhoneNumbers(userId);
  // const userIdsToNotify = await this.contactsNotifier.findContactsToNotify(userId, phoneNumbers);
  // await this.dispatcher.sendToUsers(userIdsToNotify, SocketEventType.SYNC_ALL);
  // }
  // private async checkPasswords(hashedPassword: HashedPassword, body: {oldPassword?: string, newPassword?: string}) : Promise<void> {
  // const both = body.oldPassword && body.newPassword;
  // const neither = !body.oldPassword && !body.newPassword;
  // const initial = hashedPassword.password == null && body.newPassword;
  // if ( !both && !neither && !initial) {
  // throw ErrorFactory.validationError({
  // message: ErrorMessages.BOTH_OLD_NEW_PASSWORDS,
  // path: Paths.OLD_PASSWORD_PATH
  // });
  // }
  // if (body.oldPassword) {
  // const result = await this.passwordHasher.comparePassword(hashedPassword, body.oldPassword, false);
  // if (!result.success) {
  // throw ErrorFactory.validationError({
  // message: ErrorMessages.OLD_PASSWORD_NOT_MATCH,
  // path: Paths.OLD_PASSWORD_PATH
  // });
  // }
  // }
  // }
  // async updatePrivacy(auth: AuthContext, userId: UserId, body: any) {
  // await auth.allow(Type.User, Action.Update, userId);
  // const validBody = await UserValidator.updatePrivacy(body);
  // await this.userRepo.setHidden(userId, validBody.isHidden);
  // const phoneNumbers = await this.userRepo.getPhoneNumbers(userId);
  // const userIdsToNotify = await this.contactsNotifier.userIdsWhoOnlyKnowOurPhoneNumbers(userId, phoneNumbers);
  // await this.dispatcher.sendToUsers(uniq([userId, ...userIdsToNotify]), SocketEventType.SYNC_ALL);
  // }
  // async validatePassword(auth: AuthContext, userId: string, body: any) {
  // await auth.allow(Type.UserCredentials, Action.Read, userId);
  // const validBody = await UserValidator.validatePassword(body);
  // const passwordAtts = await this.userRepo.getPasswordAttributes(userId);
  // const passwordCompareResult = await this.passwordHasher.comparePassword(passwordAtts, validBody.password, false);
  // if (!passwordCompareResult.success) {
  // throw ErrorFactory.validationError({
  // message: ErrorMessages.PASSWORD_NOT_MATCH,
  // path: Paths.PASSWORD
  // });
  // }
  // }
  // // Regenerate an sms code during registration
  // async generateSms(userId: UserId, body) {
  // const validBody = await SmsValidator.updatePhone(body);
  // const phoneNumbers = await this.userRepo.getPhoneNumbers(userId);
  // if(!phoneNumbers.includes(validBody.phoneNumber) ){
  // throw ErrorFactory.conflictError({message: ErrorMessages.PHONE_DOES_NOT_MATCH, path: Paths.PHONE });
  // }
  // const smsCode = await this.smsRepo.generateSmsCode(userId, validBody.phoneNumber);
  // await this.smsSender.sendSms(validBody.phoneNumber, smsCode);
  // }
  // // Confirm a code during registration
  // async verifyCode(session: Session, bearerToken: BearerToken, body) : Promise<{registeredMask: number}> {
  // const validBody = await SmsValidator.verifyCode(body)
  // const userId = session.getUserId();
  // const phoneNumber = await this.smsRepo.removeSmsCode(userId, validBody.code);
  // await this.userRepo.markPhoneVerified(userId, phoneNumber);
  // const user = await this.userRepo.getUserAttributes(userId);
  // // This is weird, we don't know the device id yet because we won't have created a device.
  // // So I doubt this finds anything
  // let deviceId = session.getDeviceIdIfPresent();
  // if(!deviceId) {
  // const devices = await this.userRepo.getActiveDeviceIds(userId);
  // deviceId = deviceIdToUse(devices, userId)
  // }
  // if(!deviceId){
  // logger.info("Remove device guessing");
  // }
  // //TODO This should be another state
  // const sessionInfo = await makeSessionInfo(userId, deviceId, SessionState.LoggedIn);
  // await this.sessionManager.setSessionInfo(bearerToken, sessionInfo);
  // return { registeredMask: calcRegisteredMask(user) }
  // }
  // // Generate an sms code when you have no information other than the phone number in the body
  // async requestSmsCodeLostPassword(body) : Promise<TokenBody> {
  // const validBody = await UserValidator.phoneNumber(body);
  // const findResult = await this.userRepo.findRegisteredUserByPhone(validBody.phoneNumber);
  // if(findResult.kind != FoundUserKind.Found) {
  // throw ErrorFactory.preconditionFailed(
  // {message: ErrorMessages.PHONE_NOT_REGISTERED, path: Paths.PHONE},
  // {generalErrorMessage: ErrorMessages.PHONE_NOT_REGISTERED}
  // );
  // }
  // const {user} = findResult;
  // const devices = await this.userRepo.getDeviceAttributesForUsers(user.id);
  // await Promise.all(devices.map(async device=>{
  // if(device.token) {
  // try {
  // await this.sessionManager.deleteSession(device.token)
  // }catch(e){
  // logger.error("Problem deleting session in password recovery", e)
  // }
  // }
  // await this.userRepo.clearAuthTokenForDevice(device.id)
  // }));
  // const sessionInfo = makeSessionInfo(user.id,
  // deviceIdToUse(devices.map(d=>d.id), user.id), // TODO do not guess device here
  // SessionState.RecoveringPassword);
  // const sessionHandle = await this.sessionManager.createSession(sessionInfo);
  // await this.userRepo.setAuthTokenForDevice(sessionInfo.deviceId, sessionHandle.tokens.bearer);
  // const code = await this.smsRepo.generateSmsCode(sessionInfo.userId, validBody.phoneNumber);
  // await this.smsSender.sendSms(validBody.phoneNumber, code);
  // return tokenBodyFromTokens(sessionHandle.tokens);
  // }
  // async verifySmsCodeLostPassword(bearerToken: string, session: Session, body) : Promise<TokenBody> {
  // const validBody = await UserValidator.smsCodeVerification(body);
  // await this.smsRepo.removeSmsCode(session.getUserId(), validBody.code);
  // return tokenBody(bearerToken);
  // }
  // async sendWelcomeEmail(user: UserAtts) {
  // const senderEmailAddress = {
  // name: 'The YEO Messaging Team',
  // address: 'no-reply@yeomessaging.com'
  // };
  // const receiverEmailAddress = user.email;
  // const file = readTemplate('welcome.ejs');
  // const subject = EmailStrings.YEO_WELCOME_SUBJECT
  // const firstName = user.firstName;
  // const lastName = user.lastName;
  // const rendered = ejs.render(file, {
  // firstname: firstName,
  // username: firstName + ' ' + lastName,
  // baseUrl: this.serverConfig.baseUrl,
  // });
  // const transporter = await nodemailer.createTransport(this.mailerConfig.transporter);
  // const mailOptions = {
  // from: senderEmailAddress,
  // to: receiverEmailAddress,
  // subject: subject,
  // html: rendered
  // }
  // return await transporter.sendMail(mailOptions);
  // }
  // async verifyWelcomeEmailLink(bearerToken: string) : Promise<Buffer> { // TODO: should not take bearerToken
  // const session = await this.sessionManager.getSession(bearerToken);
  // const found = await this.userRepo.markEmailVerified(session.getUserId());
  // if (!found) {
  // throw ErrorFactory.goneError(ErrorMessages.INVALID_CONFIRM_EMAIL_LINK);
  // }
  // let user = await this.userRepo.getUserAttributes(session.getUserId());
  // await this.sendWelcomeEmail(user);
  // const file = readTemplate('thanks.ejs');
  // return Buffer.from(ejs.render(file, {username: user.firstName + ' ' + user.lastName}));
  // }
  // async refreshTokens(authorization: BearerToken) {
  // return tokenBodyFromTokens(await this.sessionManager.refreshTokens(authorization), false);
  // }
  // async listUsers(auth: AuthContext, options: UserListOptions): Promise<PagedResult<QueryUserAtts>> {
  // await auth.allow(Type.User, Action.List, "all");
  // return this.userRepo.listUsers(options)
  // }
}
