import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { QuestionsServiceProvider } from '../../providers/qbapp-service/qbapp-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  title = "Question Bank";

  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, 
    public alertCtrl: AlertController, public dataService: QuestionsServiceProvider, 
    public socialSharing: SocialSharing) {
      this.loadItems();
      dataService.dataChanged$.subscribe((dataChanged: boolean) => {
        console.log('hello');
        
      });
  }
  
  loadItems() {
    console.log('loadItems');
    this.dataService.getItems().subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error);
  }

  removeItem(id) {
    this.dataService.removeItem(id);
  }

  shareItem(item, index) {
    console.log("Share Item - ", item, index);
    const toast = this.toastCtrl.create({
      message: 'sharing Item - ' + index + " ...",
      duration: 3000
    });
    toast.present();
    this.showshareItemPrompt(item, index);
  }  
 
  showshareItemPrompt(item,index) {
    let message = "Question - problem: " + item.problem + " - Technology: " + item.technology;
    let subject = "Shared via QuestionBank app";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });  

  }
  
  editItem(item, index) {
    console.log("Edit Item - ", item, index);
    const toast = this.toastCtrl.create({
      message: 'Editing Item - ' + index + " ...",
      duration: 3000
    });
    toast.present();
    this.showEditItemPrompt(item, index);
  }  

  showEditItemPrompt(item, index) {
    const prompt = this.alertCtrl.create({
      title: 'Edit Item',
      message: "Please edit item...",
      inputs: [
        {
          name: 'problem',
          placeholder: 'problem',
          value: item.problem
        },
        {
          name: 'answer',
          placeholder: 'answer',
          value: item.answer
        },
        {
          name: 'technology',
          placeholder: 'technology',
          value: item.technology
        },
         
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: item => {
            console.log('Saved clicked', item);
            this.items[index] = item;
          }
        }
      ]
    });
    prompt.present();
  } 

  addItem() {
    console.log("Adding Item");
    this.showAddItemPrompt();
  }

  showAddItemPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Add Item',
      message: "Please enter item...",
      inputs: [
        {
          name: 'problem',
          placeholder: 'problem',
        },
        {
          name: 'answer',
          placeholder: 'answer',
        },
        {
          name: 'technology',
          placeholder: 'technology',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: item => {
            console.log('Saved clicked', item);
            this.items.push(item);
          }
        }
      ]
    });
    prompt.present();
  }
}

