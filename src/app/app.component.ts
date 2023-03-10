import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VeanaideDTO} from "./model/interface.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {JuhendModalComponent} from "./juhend-modal/juhend-modal.component";
import {Subscription} from "rxjs";
import {LugerService} from "./services/luger.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // Väljavalitud viga
  viga: VeanaideDTO = {
    id: 0,
    korrektne: "",
    viga: "",
    lause: "",
    sagedus: 0
  };
  // BEst tulevad vead
  vead!: VeanaideDTO[];
  // Valed parandused, sageduse suurendamiseks
  valedParandused: VeanaideDTO[] = [];
  streak: number = 0;
  vigaLynk: boolean = false;
  vigaKirjuta: boolean = true;
  subscriptions: Subscription[] = [];
  oige: number = 0;
  kokku: number = 0;

  constructor(private http: HttpClient,
              private modalService: NgbModal,
              private lugerService: LugerService) {
  }

  //https://stackoverflow.com/questions/46848628/how-can-i-use-hostlistenerwindowbeforeunload-to-call-a-method
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: any): void {
    if (this.valedParandused.length == 0) {
      return;
    }
    this.http.post<void>("https://loputoobe-production.up.railway.app//uuenda_naited", this.valedParandused).subscribe();
  }

  ngOnInit(): void {
    this.initSubscriptions();
    this.http.get<VeanaideDTO[]>("https://loputoobe-production.up.railway.app//naited").subscribe((vead: VeanaideDTO[]) => {
      this.vead = vead;
      this.findViga(this.vead.length);
    });
    this.modalService.open(JuhendModalComponent);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  findViga(pikkus: number): void {
    if (pikkus > 0) {
      if (this.vead.length > 5) {
        let abiList: VeanaideDTO[] = this.vead.slice(this.vead.length-5, this.vead.length);
        abiList.sort(() => Math.random() - 0.5)
        let mitmes: number = 0;
        for (let i = this.vead.length-4; i < this.vead.length; i++) {
          this.vead[i] = abiList[mitmes];
          mitmes += 1;
        }
      }
      const abi: VeanaideDTO | undefined = this.vead.slice(0, pikkus).pop();
      if (abi) {
        this.viga = abi;
      }
    } else if (this.vead.length != 0) {
      const abi: VeanaideDTO | undefined = this.vead.slice(0, 1).pop();
      if (abi) {
        this.viga = abi;
      }
    }
    this.vead = this.vead.filter(veaListViga => veaListViga.id != this.viga.id);
  }

  openModal(): void {
    this.modalService.dismissAll();
    this.modalService.open(JuhendModalComponent);
  }

  findNextViga($event: boolean): void {
    if ($event) {
      let pikkus: number = this.vead.length;
      if (this.streak != 0) {
        pikkus = Math.floor(pikkus - pikkus * (this.streak / 10));
      }
      this.findViga(pikkus);
      this.lugerService.kokku$.next(this.lugerService.kokku$.value+1);
    }
  }

  maaraStreak($event: boolean): void {
    if ($event) {
      if (this.streak < 9) {
        this.streak += 1;
      }
    } else {
      this.streak = 0;
    }
  }

  lisaValeParandus($event: VeanaideDTO) {
    if (this.valedParandused.filter(parandus => parandus.id == $event.id) == null) {
      $event.sagedus = $event.sagedus + 1;
      this.valedParandused.push($event);
    }
  }

  changeClicked(): void {
    this.vigaKirjuta = !this.vigaKirjuta;
    this.vigaLynk = !this.vigaLynk;
    this.findViga(this.vead.length);
  }

  initSubscriptions(): void {
    this.subscriptions.push(this.lugerService.oige$.subscribe(oige => this.oige = oige));
    this.subscriptions.push(this.lugerService.kokku$.subscribe(kokku => this.kokku = kokku))
  }
}
