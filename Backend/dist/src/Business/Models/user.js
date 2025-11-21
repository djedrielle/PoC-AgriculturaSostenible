"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(init) {
        // Provide minimal defaults to keep instance shape predictable
        this.user_id = '';
        this.username = '';
        this.user_type = 'farmer';
        this.email = '';
        this.wallet_address = '';
        this.first_name = '';
        this.last_name = '';
        this.registration_date = new Date().toISOString();
        this.active = true;
        this.identification_number = '';
        if (init)
            Object.assign(this, init);
    }
}
exports.User = User;
