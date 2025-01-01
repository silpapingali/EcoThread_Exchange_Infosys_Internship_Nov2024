import { Component, OnInit } from '@angular/core';
import { AllTradesService } from '../../services/alltrades.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { Traded } from '../../types/traded';

@Component({
  selector: 'app-alltrades',
  standalone: true,
  imports: [FormsModule, MatPaginatorModule, CommonModule, MatTableModule],
  templateUrl: './alltrades.component.html',
  styleUrls: ['./alltrades.component.scss'],
})
export class AlltradesComponent  {
  
}
