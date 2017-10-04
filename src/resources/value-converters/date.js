import moment from 'moment';

export class DateValueConverter {
  toView(value) {
    console.log(moment);
    return moment(value).format('DD.MM.YYYY');
  }

  fromView(value) {

  }
}

