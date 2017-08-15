export interface ICommand {
  Parse(elements: string[]): void;
  LoadSettings(filename: string): void;
  Validate(): void;
  Execute(): void;
}
