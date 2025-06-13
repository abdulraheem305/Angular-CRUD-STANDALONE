import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
    name: 'markdown',
    standalone: true
})
export class MarkdownPipe implements PipeTransform {
    constructor() {
        marked.use({ async: false });
    }

    public transform(value: string): string {
        return marked.parse(value || '') as string;
    }
}
