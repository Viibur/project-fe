import {
  AfterViewInit,
  Component,
  EventEmitter, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {VeanaideDTO} from "../model/interface.model";
import {Subscription} from "rxjs";
import {LugerService} from "../services/luger.service";

@Component({
  selector: 'app-viga-kirjuta',
  templateUrl: './viga-kirjuta.component.html',
  styleUrls: ['./viga-kirjuta.component.css']
})
export class VigaKirjutaComponent implements OnInit, OnChanges {
  @Input() viga: VeanaideDTO = {
    id: 0,
    korrektne: "",
    viga: "",
    lause: "",
    sagedus: 0
  };
  @Output() parandatud: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isStreak: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() valedParandused: EventEmitter<VeanaideDTO> = new EventEmitter<VeanaideDTO>();
  oigsus: boolean = false;
  proovid: number = 3;
  vastus: string = "";
  hint: string = "";
  subscriptions: Subscription[] = [];
  oige: number = 0;
  kokku: number = 0;

  constructor(private lugerService: LugerService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['viga'].previousValue) {
      return;
    }
    if (changes['viga'].previousValue.id != changes['viga'].currentValue.id) {
      this.oigsus = false;
    }
  }

  next(): void {
    this.parandatud.emit(true);
  }

  checkVastus(): void {
    if (this.vastus == this.viga.korrektne) {
      if (this.proovid == 3) {
        this.isStreak.emit(true);
      }
      if (this.proovid != 0) {
        this.lugerService.oige$.next(this.lugerService.oige$.value+1);
      }
      this.oigsus = true;
      this.vastus = this.hint = "";
      this.proovid = 3;
      return;
    }
    this.isStreak.emit(false);

    if (this.vastus.toLowerCase() == this.viga.korrektne.toLowerCase()) {
      this.hint = "Kapitalisatsioon!"
    }
    this.valedParandused.emit(this.viga);
    this.proovid -= 1;
  }

  getLink(): string {
    return "https://sonaveeb.ee/search/unif/dlall/dsall/" + this.viga.korrektne.split(' ')[0] + "/1";
  }

  getLink2(): string {
    return "https://sonaveeb.ee/search/unif/dlall/dsall/" + this.viga.korrektne.split(' ')[1] + "/1";
  }

  @HostListener('document:keyup.enter', ['$event'])
  clickedEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.checkVastus();
    }
  }
}
