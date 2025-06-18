import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../pipes/markdown.pipe';


@Component({
  selector: 'app-markdown-page',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  templateUrl: './markdown-page.component.html',
  styleUrls: ['./markdown-page.component.scss']
})
export class MarkdownPageComponent {
  currentDate: Date = new Date();
  name: string = 'Angular Developer';
  salary: number = 123456.789;

  markdownText: string = `
# Welcome to Markdown + Angular Pipes

This page demonstrates:

- **Angular Built-in Pipes**
- **Custom Pipe for Markdown**

### Built-in Pipe Examples:

- Current Date: \`{{ currentDate | date:'fullDate' }}\`
- Name (Uppercase): \`{{ name | uppercase }}\`
- Salary (Currency): \`{{ salary | currency }}\`

---

> ✨ Feel free to edit this Markdown and see the result!
`;
}
