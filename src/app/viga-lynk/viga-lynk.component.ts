import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import {VeanaideDTO} from "../model/interface.model";
import {Subscription} from "rxjs";
import {LugerService} from "../services/luger.service";

@Component({
  selector: 'app-viga-lynk',
  templateUrl: './viga-lynk.component.html',
  styleUrls: ['./viga-lynk.component.css']
})
export class VigaLynkComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() viga!: VeanaideDTO;
  @Output() parandatud: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isStreak: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() valedParandused: EventEmitter<VeanaideDTO> = new EventEmitter<VeanaideDTO>();
  proovid: number = 1;
  vastus: string = "";
  button1Text: string = "";
  button2Text: string = "";
  kasArvatud: boolean = false;
  subscriptions: Subscription[] = [];
  oige: number = 0;
  kokku: number = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private lugerService: LugerService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['viga'].previousValue) {
      return;
    }
    if (changes['viga'].previousValue.id != changes['viga'].currentValue.id) {
      this.kasArvatud = false;
      this.proovid = 1;
      this.findButtonText();
    }
  }

  ngAfterViewInit() {
    this.findButtonText();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  next(): void {
    this.parandatud.emit(true);
  }

  checkVastus(valitud: string): void {
    this.kasArvatud = true;
    if (valitud != this.viga.korrektne) {
      this.proovid = 0;
    } else {
      this.lugerService.oige$.next(this.lugerService.oige$.value+1);
    }
  }

  getLink(): string {
    return "https://sonaveeb.ee/search/unif/dlall/dsall/" + this.viga.korrektne.split(' ')[0] + "/1";
  }

  getLink2(): string {
    return "https://sonaveeb.ee/search/unif/dlall/dsall/" + this.viga.korrektne.split(' ')[1] + "/1";
  }

  button1Click(): void {
    this.checkVastus(this.button1Text);
  }

  button2Click(): void {
    this.checkVastus(this.button2Text);
  }

  findButtonText(): void {
    if (Math.random() < 0.5) {
      this.button1Text = this.viga.korrektne;
      this.button2Text = this.viga.viga;
    } else {
      this.button1Text = this.viga.viga;
      this.button2Text = this.viga.korrektne;
    }
  }

  getLauseFirstHalf(): string {
    let lauseFirstHalfEnd: number = this.viga.lause.indexOf(this.viga.viga);
    if (lauseFirstHalfEnd != -1) {
      return this.viga.lause.substring(0, lauseFirstHalfEnd);
    }
    return "";
  }

  getLauseSecondHalf(): string {
    let lauseSecondHalfStart: number = this.viga.lause.indexOf(this.viga.viga);
    if (lauseSecondHalfStart != -1) {
      return this.viga.lause.substring(lauseSecondHalfStart + this.viga.viga.length);
    }
    return "";
  }

  initSubscriptions(): void {
    this.subscriptions.push(this.lugerService.oige$.subscribe(oige => this.oige = oige));
    this.subscriptions.push(this.lugerService.kokku$.subscribe(kokku => this.kokku = kokku))
  }
}
