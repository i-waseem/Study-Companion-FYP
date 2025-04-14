describe('String Tests', () => {
  test('String operations', () => {
    const str = 'Study Companion';
    
    // Test string length
    expect(str.length).toBe(15);
    
    // Test string methods
    expect(str.toLowerCase()).toBe('study companion');
    expect(str.toUpperCase()).toBe('STUDY COMPANION');
    
    // Test string splitting
    expect(str.split(' ')).toEqual(['Study', 'Companion']);
  });

  test('String includes', () => {
    const str = 'Welcome to Study Companion';
    
    expect(str.includes('Study')).toBe(true);
    expect(str.includes('Companion')).toBe(true);
    expect(str.includes('NotHere')).toBe(false);
  });
});
