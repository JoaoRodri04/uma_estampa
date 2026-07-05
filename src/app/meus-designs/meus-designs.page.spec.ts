import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusDesignsPage } from './meus-designs.page';

describe('MeusDesignsPage', () => {
  let component: MeusDesignsPage;
  let fixture: ComponentFixture<MeusDesignsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusDesignsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
