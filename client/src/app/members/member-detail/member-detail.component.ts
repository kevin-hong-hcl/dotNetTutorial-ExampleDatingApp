import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from "@kolkov/ngx-gallery";
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take, map } from 'rxjs/operators';

import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild("memberTabs", {static: true}) memberTabs: TabsetComponent;
  member?: Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;
  routePathBase: string;

  constructor(
    public presence: PresenceService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    });
    // this.loadMember();

    this.route.queryParams.subscribe(params => {
      console.log("QUERY PARAMS CHANGED")
      console.log(params)
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    if (!!this.member) {
      this.galleryOptions = [
        {
          width: "500px",
          height: "500px",
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
        }
      ];
    }

    this.galleryImages = this.getImages();

    this.route.url.pipe(take(1)).subscribe(urlSegments => {
      this.routePathBase = `/${urlSegments.map(a => a.path).join("/")}`;
    })
  }


  // loadMember() {
  //   this.memberService.getMember(this.route.snapshot.paramMap.get("username")!).subscribe(member => {
  //     this.member = member;
  //     this.galleryImages = this.getImages();
  //   });
    
  // }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member!.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      }); 
    }
    return imageUrls;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    // UPDATE QUERY PARAMS
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: tabId}
      }
    );
    
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective, tabId: number) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: tabId}
      }
    );

    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
