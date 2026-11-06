import SwiftUI

struct ModalDialogExample: View {
    @State private var showsDetails = false

    var body: some View {
        Button("Open details") { showsDetails = true }
            .sheet(isPresented: $showsDetails) {
                ModalDetailsExample()
            }
    }
}

private struct ModalDetailsExample: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Details").font(.title).accessibilityAddTraits(.isHeader)
                Text("This is an educational example, not a saved operation.")
                Button("Close details") { dismiss() }
            }
            .padding()
        }
        .frame(minWidth: 240, minHeight: 200)
    }
}
