import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFamilyMember } from './add-family-member';

describe('AddFamilyMember', () => {
  let component: AddFamilyMember;
  let fixture: ComponentFixture<AddFamilyMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFamilyMember],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFamilyMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
