import openpyxl
import os

file_path = r"d:\codex-work\4.08-4.14.xlsx"

if os.path.exists(file_path):
    wb = openpyxl.load_workbook(file_path)
    print("📋 可用Sheet:")
    for i, sheet_name in enumerate(wb.sheetnames, 1):
        print(f"  Sheet{i}: {sheet_name}")
    
    # 读取所有sheet的摘要
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        print(f"\n\n{'='*80}")
        print(f"【 {sheet_name} 】")
        print(f"{'='*80}")
        
        # 显示所有行
        for i, row in enumerate(ws.iter_rows(values_only=True), 1):
            if i > 30:
                print(f"... (还有更多行)")
                break
            print(row)
else:
    print("❌ 文件不存在")
