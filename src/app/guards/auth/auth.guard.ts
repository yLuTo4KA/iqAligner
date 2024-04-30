import { CanActivateFn, Router } from '@angular/router';

import { AuthorizationService } from '../../services/authorization/authorization.service';
import { DialogsService } from '../../services/dialogs/dialogs.service';

import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state): boolean => {
  const dialogsService = inject(DialogsService);
  if(inject(AuthorizationService).isLoggin()) {
    return true;
  }else {
    inject(Router).navigate(["/home"]);
    dialogsService.openAuthDialog();
    return false;
  }
};
