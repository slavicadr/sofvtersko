import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatPoruka } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  getPoruke(kupovinaId: number, korisnikId: number) {
    return this.http.get<ChatPoruka[]>(`/api/chat/${kupovinaId}/poruke?korisnikId=${korisnikId}`);
  }

  posaljiPoruku(kupovinaId: number, posiljalacId: number, sadrzaj: string) {
    return this.http.post<ChatPoruka>(`/api/chat/${kupovinaId}/poruka`, { posiljalacId, sadrzaj });
  }
}
