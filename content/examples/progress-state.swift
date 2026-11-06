import SwiftUI

struct ProgressStateExample: View {
    @State private var completed = 0
    private let total = 4

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Manual progress demonstration").font(.headline)
            Text("No upload or background operation is running.")
            ProgressView(value: Double(completed), total: Double(total)) {
                Text("Example steps")
            }
            Text(completed == total ? "Demonstration complete." : "\(completed) of \(total) steps")
            Button("Complete next step") { completed = min(total, completed + 1) }
                .disabled(completed == total)
            Button("Reset demonstration") { completed = 0 }
        }
        .padding()
    }
}
