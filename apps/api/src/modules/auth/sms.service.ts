import { Injectable } from '@nestjs/common';
import { env } from '../../config/env';

@Injectable()
export class SmsService {

  private cachedToken: string | null = null;
  private tokenExpiresAt = 0;

  private async getEskizToken(): Promise<string | null> {
    if (!env.ESKIZ_EMAIL || !env.ESKIZ_PASSWORD) return null;

    if (this.cachedToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedToken;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('email', env.ESKIZ_EMAIL);
      formData.append('password', env.ESKIZ_PASSWORD);

      const resp = await fetch('https://notify.eskiz.uz/api/auth/login', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (data?.data?.token) {
        this.cachedToken = data.data.token;
        this.tokenExpiresAt = Date.now() + 25 * 24 * 3600 * 1000;
        return this.cachedToken;
      }
    } catch (err) {
      console.error('Eskiz auth error:', err);
    }
    return null;
  }

  async sendOtp(phone: string, code: string): Promise<{ success: boolean; mode: 'real_sms' | 'simulation'; message: string }> {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 9) {
      cleanPhone = '998' + cleanPhone;
    }

    const message = `BunkerStroy platformasi tasdiqlash kodi: ${code}`;

    const token = await this.getEskizToken();
    if (token) {
      try {
        const formData = new URLSearchParams();
        formData.append('mobile_phone', cleanPhone);
        formData.append('message', message);
        formData.append('from', env.ESKIZ_FROM);

        const resp = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const data = await resp.json();

        return {
          success: true,
          mode: 'real_sms',
          message: data?.message || 'SMS muvaffaqiyatli yuborildi'
        };
      } catch (err: any) {
        console.error('Failed to send real SMS via Eskiz:', err);
      }
    }

    // Dev simulation fallback
    console.log(`[SMS SIMULATION] To: +${cleanPhone} -> Code: ${code}`);
    return {
      success: true,
      mode: 'simulation',
      message: `SMS tasdiqlash kodi: ${code} (Test rejimi)`
    };
  }
}

export const smsService = new SmsService();
