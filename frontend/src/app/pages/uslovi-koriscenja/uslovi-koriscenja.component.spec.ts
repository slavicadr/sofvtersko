declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsloviKoriscenjaComponent } from './uslovi-koriscenja.component';


describe('UsloviKoriscenjaComponent', () => {
  let component: UsloviKoriscenjaComponent;
  let fixture: ComponentFixture<UsloviKoriscenjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsloviKoriscenjaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsloviKoriscenjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
