import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PravniUgovorComponent } from './pravni-ugovor.component';

describe('PravniUgovorComponent', () => {
  let component: PravniUgovorComponent;
  let fixture: ComponentFixture<PravniUgovorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PravniUgovorComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PravniUgovorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
