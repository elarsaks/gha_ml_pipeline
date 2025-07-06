#!/usr/bin/env python3
"""
ML Pipeline Health Check Script

This script validates the current project structure against ML lifecycle best practices.
"""

import os
import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple


class MLLifecycleChecker:
    """Check ML pipeline components against lifecycle stages."""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results = {}
        
    def check_data_collection(self) -> Tuple[bool, List[str]]:
        """Check data collection components."""
        issues = []
        
        # Check data directories
        data_dir = self.project_root / "data"
        if not data_dir.exists():
            issues.append("❌ Data directory missing")
        else:
            raw_dir = data_dir / "raw"
            processed_dir = data_dir / "processed"
            
            if not raw_dir.exists():
                issues.append("❌ Raw data directory missing")
            elif not any(raw_dir.iterdir()):
                issues.append("⚠️ Raw data directory empty")
            else:
                issues.append("✅ Raw data directory exists with data")
                
            if not processed_dir.exists():
                issues.append("❌ Processed data directory missing")
            elif not any(processed_dir.iterdir()):
                issues.append("⚠️ Processed data directory empty")
            else:
                issues.append("✅ Processed data directory exists with data")
        
        # Check data fetching tools
        rust_fetch_dir = self.project_root / "rust_fetch"
        if not rust_fetch_dir.exists():
            issues.append("❌ Data fetching tools missing")
        else:
            fetch_bin = rust_fetch_dir / "src" / "bin" / "fetch_data.rs"
            if fetch_bin.exists():
                issues.append("✅ Data fetching binary exists")
            else:
                issues.append("❌ Data fetching binary missing")
        
        # Check data validation
        if rust_fetch_dir.exists():
            validate_bin = rust_fetch_dir / "src" / "bin" / "validate_jsonl.rs"
            if validate_bin.exists():
                issues.append("✅ Data validation tools exist")
            else:
                issues.append("❌ Data validation tools missing")
        
        return len([i for i in issues if i.startswith("❌")]) == 0, issues
    
    def check_model_training(self) -> Tuple[bool, List[str]]:
        """Check model training components."""
        issues = []
        
        # Check training directory
        train_dir = self.project_root / "python_train"
        if not train_dir.exists():
            issues.append("❌ Training directory missing")
            return False, issues
        
        # Check environment setup
        env_file = train_dir / "environment.yml"
        if env_file.exists():
            issues.append("✅ Conda environment file exists")
        else:
            issues.append("❌ Environment configuration missing")
        
        # Check training notebooks/scripts
        notebook = train_dir / "linear_regression_training.ipynb"
        if notebook.exists():
            issues.append("✅ Training notebook exists")
        else:
            issues.append("❌ Training notebook missing")
        
        # Check source code
        src_dir = train_dir / "src"
        if src_dir.exists() and any(src_dir.glob("*.py")):
            issues.append("✅ Training source code exists")
        else:
            issues.append("❌ Training source code missing")
        
        # Check tests
        test_dir = train_dir / "tests"
        if test_dir.exists() and any(test_dir.glob("test_*.py")):
            issues.append("✅ Training tests exist")
        else:
            issues.append("❌ Training tests missing")
        
        return len([i for i in issues if i.startswith("❌")]) == 0, issues
    
    def check_model_evaluation(self) -> Tuple[bool, List[str]]:
        """Check model evaluation components."""
        issues = []
        
        # Check if evaluation is in notebook
        train_dir = self.project_root / "python_train"
        notebook = train_dir / "linear_regression_training.ipynb"
        
        if notebook.exists():
            # Read notebook and check for evaluation
            try:
                with open(notebook, 'r') as f:
                    notebook_content = f.read()
                    if "mean_squared_error" in notebook_content:
                        issues.append("✅ Basic evaluation metrics present")
                    else:
                        issues.append("❌ No evaluation metrics found")
                    
                    if "train_test_split" in notebook_content or "X_train" in notebook_content:
                        issues.append("✅ Train/test split implemented")
                    else:
                        issues.append("❌ No train/test split found")
                    
                    # Check for advanced evaluation
                    if "cross_val_score" in notebook_content:
                        issues.append("✅ Cross-validation implemented")
                    else:
                        issues.append("⚠️ No cross-validation found")
                    
                    if "mae" in notebook_content or "mape" in notebook_content:
                        issues.append("✅ Multiple metrics implemented")
                    else:
                        issues.append("⚠️ Limited evaluation metrics")
                        
            except Exception as e:
                issues.append(f"❌ Error reading notebook: {e}")
        else:
            issues.append("❌ Training notebook not found")
        
        return len([i for i in issues if i.startswith("❌")]) == 0, issues
    
    def check_model_shipping(self) -> Tuple[bool, List[str]]:
        """Check model shipping/deployment components."""
        issues = []
        
        # Check model storage
        models_dir = self.project_root / "models"
        if not models_dir.exists():
            issues.append("❌ Models directory missing")
        else:
            model_files = list(models_dir.glob("*.csv"))
            if model_files:
                issues.append("✅ Model files exist")
            else:
                issues.append("❌ No model files found")
            
            metadata_file = models_dir / "model_metadata.json"
            if metadata_file.exists():
                issues.append("✅ Model metadata exists")
            else:
                issues.append("❌ Model metadata missing")
        
        # Check CI/CD
        github_dir = self.project_root / ".github" / "workflows"
        if github_dir.exists():
            workflow_files = list(github_dir.glob("*.yml"))
            if workflow_files:
                issues.append("✅ CI/CD workflows exist")
            else:
                issues.append("❌ No CI/CD workflows found")
        else:
            issues.append("❌ GitHub workflows directory missing")
        
        return len([i for i in issues if i.startswith("❌")]) == 0, issues
    
    def check_monitoring(self) -> Tuple[bool, List[str]]:
        """Check monitoring components."""
        issues = []
        
        # Check for monitoring setup
        # This is currently limited in the project
        issues.append("❌ No dedicated monitoring setup found")
        issues.append("❌ No performance metrics logging")
        issues.append("❌ No alerting configuration")
        issues.append("❌ No drift detection")
        
        # Check for basic logging in workflows
        github_dir = self.project_root / ".github" / "workflows"
        if github_dir.exists():
            issues.append("✅ Basic CI/CD logging available")
        
        return False, issues
    
    def check_improvement_loop(self) -> Tuple[bool, List[str]]:
        """Check continuous improvement components."""
        issues = []
        
        # Check for model versioning
        models_dir = self.project_root / "models"
        if models_dir.exists():
            model_files = list(models_dir.glob("*.csv"))
            if len(model_files) > 1:
                issues.append("✅ Multiple model versions exist")
            else:
                issues.append("⚠️ Limited model versioning")
        
        # Check for retraining capability
        github_dir = self.project_root / ".github" / "workflows"
        if github_dir.exists():
            train_workflow = github_dir / "train_model.yml"
            if train_workflow.exists():
                issues.append("✅ Automated retraining available")
            else:
                issues.append("❌ No automated retraining")
        
        # Check for feedback loops
        issues.append("❌ No feedback collection mechanism")
        issues.append("❌ No automated performance monitoring")
        issues.append("❌ No scheduled retraining")
        
        return False, issues
    
    def run_full_check(self) -> Dict[str, Tuple[bool, List[str]]]:
        """Run complete ML lifecycle check."""
        checks = {
            "Data Collection": self.check_data_collection(),
            "Model Training": self.check_model_training(),
            "Model Evaluation": self.check_model_evaluation(),
            "Model Shipping": self.check_model_shipping(),
            "Monitoring": self.check_monitoring(),
            "Improvement Loop": self.check_improvement_loop()
        }
        
        return checks
    
    def print_report(self, checks: Dict[str, Tuple[bool, List[str]]]):
        """Print formatted health check report."""
        print("\n🔍 ML Pipeline Health Check Report")
        print("=" * 50)
        
        overall_score = 0
        total_stages = len(checks)
        
        for stage, (passed, issues) in checks.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"\n{stage}: {status}")
            print("-" * 30)
            
            if passed:
                overall_score += 1
                
            for issue in issues:
                print(f"  {issue}")
        
        print(f"\n📊 Overall Score: {overall_score}/{total_stages}")
        print(f"🎯 Maturity Level: {self.get_maturity_level(overall_score, total_stages)}")
        
        return overall_score, total_stages
    
    def get_maturity_level(self, score: int, total: int) -> str:
        """Determine maturity level based on score."""
        percentage = (score / total) * 100
        
        if percentage >= 80:
            return "Advanced (Stage 4/4)"
        elif percentage >= 60:
            return "Systematic (Stage 3/4)"
        elif percentage >= 40:
            return "Basic Automation (Stage 2/4)"
        else:
            return "Ad-hoc (Stage 1/4)"


def main():
    """Main function to run the health check."""
    if len(sys.argv) > 1:
        project_root = sys.argv[1]
    else:
        project_root = "."
    
    checker = MLLifecycleChecker(project_root)
    checks = checker.run_full_check()
    score, total = checker.print_report(checks)
    
    # Exit with appropriate code
    exit_code = 0 if score >= total * 0.6 else 1
    sys.exit(exit_code)


if __name__ == "__main__":
    main()