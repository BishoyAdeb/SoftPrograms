import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SegmentCustomEvent } from '@ionic/angular';
import { AlertService } from '../services/alert.service';

interface SegmentInformation {
  name: string;
  segmentCode: string;
}
interface SegmentSection {
  allAvaliableSegments: SegmentInformation[];
  selectedSegment: SegmentInformation;
}
interface CompanySection {
  visible: boolean;
  formGroup: FormGroup;
}
interface ShareCapitalSection {
  visible: boolean;
  formGroup: FormGroup;
}
interface ActivitySection {
  visible: boolean;
  formGroup: FormGroup;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit {
  @ViewChild('progressCircle', { static: false })
  progressCircle!: ElementRef<SVGPathElement>;
  @ViewChild('progressValue', { static: false })
  progressValue!: ElementRef<HTMLSpanElement>;

  //#region variables
  private progress: number = 0; // to calc the progress
  showDivisionForm: boolean = false; // Show the Division Form if true
  isModalOpen: boolean = false; // State variable to control modal visibility
  selectedCardIndex: number | null = null; // Track which card is being edited

  // array to show in ion-select
  divisionNames: any[] = [
    { name: 'Name 1', code: '1' },
    { name: 'Name 2', code: '2' },
    { name: 'Name 3', code: '3' },
    { name: 'Name 4', code: '4' },
    { name: 'Name 5', code: '5' },
  ];
  // segments names if we need to add more *add here*
  segmentSection: SegmentSection = {
    allAvaliableSegments: [
      {
        name: 'الشركاء',
        segmentCode: '1',
      },
      {
        name: 'بيانات النشاط',
        segmentCode: '2',
      },
      {
        name: 'بيانات راس المال',
        segmentCode: '3',
      },
    ],
    selectedSegment: { name: '', segmentCode: '' },
  };
  // form of company segment *الشركاء*
  companySection: CompanySection = {
    visible: true,
    formGroup: this.formBuilder.group({
      companyDetails: [''],
    }),
  };
  // form of shareCapital segment *بيانات راس المال*
  shareCapitalSection: ShareCapitalSection = {
    visible: false,
    formGroup: this.formBuilder.group({
      paidUpCapital: [''],
      accountableCapital: [''],
      shareCapitalDetails: [''],
      date: [''],
    }),
  };
  // form of activity segment *بيانات النشاط*
  activitySection: ActivitySection = {
    visible: false,
    formGroup: this.formBuilder.group({
      activityCheckBox: [false],
      divisionCheckBox: [false],
      divisionName: ['', Validators.required],
      divisionDate: ['', Validators.required],
      activityDetails: [''],
      active: [false],
      cards: this.formBuilder.array([]),
    }),
  };
  // card array
  cardForm = this.formBuilder.group({
    name: [''],
    date: [''],
  });

  editCardForm = this.formBuilder.group({
    name: [''],
    date: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {}

  //#region functions

  ngOnInit() {
    this.segmentSection.selectedSegment =
      this.segmentSection.allAvaliableSegments[0]; // Set initial value to select first segment
  }
  ngAfterViewInit(): void {
    this.updateProgress(1, this.segmentSection.allAvaliableSegments.length); // initial progress first tab or segment
  }
  get cards(): FormArray {
    return this.activitySection.formGroup.get('cards') as FormArray; // get cards as form array
  }
  //change segment
  segmentChanging(event: any): void {
    // find the code of segment that i want and put it in selected Segment
    const segmentEvent = event as SegmentCustomEvent;
    this.segmentSection.selectedSegment =
      this.segmentSection.allAvaliableSegments.find(
        (x) => x.segmentCode === segmentEvent.detail.value
      ) ?? { name: '', segmentCode: '' };

    this.changeForm();
  }
  changeForm(): void {
    // according to segment i want i will hide and visible forms
    switch (this.segmentSection.selectedSegment.segmentCode) {
      case '1': {
        this.companySection.visible = true;
        this.shareCapitalSection.visible = false;
        this.activitySection.visible = false;
        break;
      }
      case '2': {
        this.companySection.visible = false;
        this.shareCapitalSection.visible = false;
        this.activitySection.visible = true;
        break;
      }
      case '3': {
        this.companySection.visible = false;
        this.shareCapitalSection.visible = true;
        this.activitySection.visible = false;
        break;
      }
    }
    this.updateProgress(
      Number(this.segmentSection.selectedSegment.segmentCode),
      3
    );
  }
  // if i want to use button to change the segment *forward*
  moveForward(): void {
    //get current index
    const currentIndex = this.segmentSection.allAvaliableSegments.indexOf(
      this.segmentSection.selectedSegment
    );

    //get the next index
    const nextIndex =
      (currentIndex + 1) % this.segmentSection.allAvaliableSegments.length;

    //move to selected index
    this.segmentSection.selectedSegment =
      this.segmentSection.allAvaliableSegments[nextIndex];
    this.changeForm();
  }
  // if i want to use button to change the segment *backward*
  moveBackward(): void {
    //get current index
    const currentIndex = this.segmentSection.allAvaliableSegments.indexOf(
      this.segmentSection.selectedSegment
    );

    //get the previous index
    const prevIndex =
      (currentIndex - 1 + this.segmentSection.allAvaliableSegments.length) %
      this.segmentSection.allAvaliableSegments.length;

    //move to selected index
    this.segmentSection.selectedSegment =
      this.segmentSection.allAvaliableSegments[prevIndex];
    this.changeForm();
  }
  // change checkbox of *تعديل الشُعب* in *بيانات النشاط* segment
  divisionCheckBoxChange(event: any): void {
    if (event.detail.checked) {
      this.showDivisionForm = true; // show the form
      // uncheck the activityCheckBox
      this.activitySection.formGroup.patchValue({
        activityCheckBox: false,
      });
    } else this.showDivisionForm = false; //hide the form
  }
  // change checkbox of *تعديل الانشطة*  in *بيانات النشاط* segment
  activityCheckBoxChange(event: any): void {
    if (event.detail.checked) {
      this.showDivisionForm = false; //hide Division Form
      // uncheck divisionCheckBox
      this.activitySection.formGroup.patchValue({
        divisionCheckBox: false,
      });
    }
  }
  activationToggle(event: any): void {
    //toggle of *نشط*
    console.log(event.detail);
  }
  updateProgress(firstValue: number, secondValue: number): void {
    // Calculate the progress percentage
    this.progress = (firstValue / secondValue) * 100;

    // Update the stroke-dasharray to match the progress
    const circle = this.progressCircle.nativeElement;
    circle.style.strokeDasharray = `${this.progress}, 100`;

    // Update text in the center of the circle
    const progressValue = this.progressValue.nativeElement;
    progressValue.textContent = `${firstValue} of ${secondValue}`;
  }
  addCard(): void {
    // check if form vaild
    if (!this.activitySection.formGroup.valid) {
      this.alertService.showAlertError('يجب إدخال الاسم و التاريخ');
      return;
    }
    // add the data in card form
    this.cardForm.patchValue({
      name: this.divisionNames.find(
        (x) => x.code === this.activitySection.formGroup.value.divisionName
      ).name,
      date: this.activitySection.formGroup.value.divisionDate,
    });
    // push it in form array
    this.cards.push(this.formBuilder.group(this.cardForm.value));
    // reset the form
    this.activitySection.formGroup.patchValue({
      divisionName: '',
      divisionDate: '',
    });
  }
  removeCard(index: number): void {
    // remove card with index
    this.cards.removeAt(index);
  }
  openEditModal(index: number): void {
    this.selectedCardIndex = index; // set the selected card index
    this.isModalOpen = true; // open the modal
  }
  closeModal(): void {
    this.editCardForm.patchValue({
      name: '',
      date: '',
    });
    this.isModalOpen = false; // close the modal
    this.selectedCardIndex = null; // reset selected card index
  }
  saveChanges() {
    if (this.selectedCardIndex !== null) {
      this.cards.at(this.selectedCardIndex).patchValue({
        name: this.editCardForm.value.name
          ? this.divisionNames.find(
              (x) => x.code === this.editCardForm.value.name
            ).name
          : this.activitySection.formGroup.value.cards[this.selectedCardIndex]
              .name,
        date: this.editCardForm.value.date
          ? this.editCardForm.value.date
          : this.activitySection.formGroup.value.cards[this.selectedCardIndex]
              .date,
      });
    }
    this.closeModal();
  }
}
